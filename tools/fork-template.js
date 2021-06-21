#!/usr/bin/env node
require('./lib/check-runtime-env').assertNodeVersion();
const { Octokit } = require("octokit");
const { retry } = require("@octokit/plugin-retry");
const prompts = require('prompts');
const{
  urlValidator,
  requiredValidator,
  makeLogPrompt
} = require('./lib/prompt-utils');
const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');
const { combine, json, timestamp } = format;

const forkLogFile = path.join(process.cwd(), 'fork.log');
const logger = createLogger({
  level: 'debug',
  format: combine(timestamp(), json()),
  transports: [new transports.File({ filename: forkLogFile, handleExceptions: true })]
});
const logPrompt = makeLogPrompt(logger);

const TMPL_OWNER = 'hestiaAI';
const TMPL_REPO = 'website.template';

const handleApiError = (error) => {
  logger.error('error', { "response": error.response });
  console.error('api call failed', error.response.data);
  return error.response;
};

const handleApiResponse = (message, response) => {
  console.log(message);
  logger.info(message);
  logger.debug(message, { response: response });
  return response;
};

async function getAuthenticated(octo) {
  try {
    const rsp = await octo.rest.users.getAuthenticated();
    const msg = `Logged in github as user ${rsp.data.login}`;
    return handleApiResponse(msg, rsp);
  } catch (error) {return handleApiError(error);}
}

async function listForks(octo, owner, repo) {
  // https://docs.github.com/en/rest/reference/repos#create-a-fork
  try {
    const rsp = await octo.rest.repos.listForks({owner, repo});
    const msg = `Found ${rsp.data.length} forks of ${owner}/${repo}`;
    return handleApiResponse(msg, rsp);
  } catch (error) {return handleApiError(error);}
}

async function forkRepo(octo, owner, repo) {
  // https://docs.github.com/en/rest/reference/repos#create-a-fork
  try {
    const rsp = await octo.rest.repos.createFork({owner, repo});
    const msg = `Forked ${rsp.data.full_name} from ${rsp.data.parent.full_name}`;
    return handleApiResponse(msg, rsp);
  } catch (error) {return handleApiError(error);}
}

async function updateRepo(octo, owner, repo,
                          {name, has_issues, description, homepage}) {
  // https://docs.github.com/en/rest/reference/repos#update-a-repository
  try {
    const props = {name, has_issues, description, homepage};
    const rsp = await octo.rest.repos.update({owner, repo, ...props});
    const msg = `Updated ${owner}/${repo} with ${JSON.stringify(props)}`;
    return handleApiResponse(msg, rsp);
  } catch (error) {return handleApiError(error);}
}

async function replaceAllTopics(octo, owner, repo, names) {
  // https://docs.github.com/en/rest/reference/repos#replace-all-repository-topics
  try {
    const rsp = await octo.rest.repos.replaceAllTopics({owner, repo, names});
    const msg = `Set topics of ${owner}/${repo} to ${names}`;
    return handleApiResponse(msg, rsp);
  } catch (error) {return handleApiError(error);}
}

async function deleteRepo(octo, owner, repo) {
  try {
    const rsp = await octo.rest.repos.delete({ owner, repo });
    const msg = `Deleted repo ${owner}/${repo} `;
    return handleApiResponse(msg, rsp);
  } catch (error) {return handleApiError(error);}
}

async function listIssueLabels(octo, owner, repo) {
  try {
    const rsp = await octo.rest.issues.listLabelsForRepo({ owner, repo });
    const msg = `Found ${rsp.data.length} issue labels at ${owner}/${repo}`;
    return handleApiResponse(msg, rsp);
  } catch (error) {return handleApiError(error);}
}

async function createIssueLabel(octo, owner, repo,
                                {name, color, description}) {
  // see https://docs.github.com/en/rest/reference/issues#create-a-label
  try {
    const label = {name, color, description};
    const rsp = await octo.rest.issues.createLabel({owner, repo, ...label});
    const msg = `Created label ${rsp.data.name} at ${owner}/${repo}`;
    return handleApiResponse(msg, rsp);
  } catch (error) {return handleApiError(error);}
}

async function createIssueLabels(octo, owner, repo, labels) {
  try {
    return await Promise.all(labels.map(async (label) =>
      await createIssueLabel(octo, owner, repo, label)));
  } catch (error) {
    logger.error('error', { error });
    console.error(error);
  }
}

async function deleteIssueLabel(octo, owner, repo, name) {
  try {
    const rsp = await octo.rest.issues.deleteLabel({owner, repo, name});
    const msg = `Deleted label ${name} from ${owner}/${repo} `;
    return handleApiResponse(msg, rsp);
  } catch (error) {return handleApiError(error);}
}

async function deleteAllIssueLabels(octo, owner, repo) {
  try {
    const labels = await listIssueLabels(octo, owner, repo);
    return await Promise.all(labels.data.map(async (l) =>
      await deleteIssueLabel(octo, owner, repo, l.name)));
  } catch (error) {
    logger.error('error', { error });
    console.error(error);
  }
}

async function listIssues(octo, owner, repo) {
  try {
    // see https://docs.github.com/en/rest/reference/issues#list-repository-issues
    const rsp = await octo.rest.issues.listForRepo({ owner, repo });
    const msg = `Found ${rsp.data.length} issues at ${owner}/${repo}`;
    return handleApiResponse(msg, rsp);
  } catch (error) {return handleApiError(error);}
}

async function createIssue(octo, owner, repo, {title, body, labels}) {
  try {
    // see https://docs.github.com/en/rest/reference/issues#create-an-issue
    const rsp = await octo.rest.issues.create({ owner, repo, title, body, labels });
    const msg = `created "${rsp.data.title}" at ${owner}/${repo}`;
    return handleApiResponse(msg, rsp);
  } catch (error) {return handleApiError(error);}
}

function cloneIssueData({ title, body, labels }) {
  return { title, body, labels: labels.map(l => l.name) }
}

async function createIssues(octo, owner, repo, issues) {
  try {
    return await Promise.all(issues.map(async (issue) =>
      await createIssue(octo, owner, repo, issue)
    ));
  } catch (error) {
    logger.error('error', { error });
    console.error(error);
  }
}

async function findForkOf(octo, forkOwner, owner, repo){
  const forks = await listForks(octo, owner, repo);
  const fork = forks?.data?.find(f => f.owner.login == forkOwner);
  return fork?.html_url;
}

const Q_GITHUB_AUTH_TOKEN = 'authToken';
const Q_SITE_URL = 'siteUrl';
const Q_REPO_NAME = 'repoName';
const Q_DESCRIPTION =  'description';
const Q_TOPICS = 'topics';
const Q_CONFIRM = 'confirm';
const Q_CONFIRM_DELETE_FORK = 'confirmDeleteFork';

const TOKEN_QUESTION = {
  type: 'password',
  name: Q_GITHUB_AUTH_TOKEN,
  message: "Github auth token of user who will own the fork:",
  validate: requiredValidator
};

const DELETE_FORK_QUESTION = {
  type: 'confirm',
  name: Q_CONFIRM_DELETE_FORK,
  message:  'Delete existing fork? Really?'
};

const QUESTIONS = [
  {
    type: 'text',
    name: Q_SITE_URL,
    message: 'URL of the website (optional ex: "dapr.hestialabs.org")',
    validate: urlValidator
  },
  {
    type: 'text',
    name: Q_REPO_NAME,
    message: 'Name of the github repo (ex: "website.dp")',
    validate: requiredValidator
  },
  {
    type: 'text',
    name: Q_DESCRIPTION,
    message: 'Description of the repo (optional ex: "HestiaLabs website for Dating Privacy")',
  },
  {
    type: 'list',
    name: Q_TOPICS,
    message: 'Topics fo the repo',
    initial: 'community, website',
  },
  {
    type: 'confirm',
    name: Q_CONFIRM,
    message: (_prev, values) => `Create fork ${values[Q_REPO_NAME]} ?`,
  }
];

async function provideAccessToken(){
    const tokenFileName =
          path.join(process.cwd(), 'tools/.fork-user-auth-token');
    if(fs.existsSync(tokenFileName)){
      console.log('Found', tokenFileName)
      return fs.readFileSync(tokenFileName).toString().trim()
    }else{
      console.log('No access token file: ', tokenFileName);
      console.log('You can create one at https://github.com/settings/tokens' )
      const response = await prompts(TOKEN_QUESTION, {onSubmit: logPrompt});
      return response[Q_GITHUB_AUTH_TOKEN];
    }
}

async function deleteFork(octo, forkUrl){
  const response = await prompts(DELETE_FORK_QUESTION, {onSubmit: logPrompt});
  if(!response[Q_CONFIRM_DELETE_FORK]){
    return false;
  }
  const splitForkUrl = forkUrl.split('/');
  const [user, repo] = splitForkUrl.slice(splitForkUrl.length - 2);
  const del = await deleteRepo(octo, user, repo);
  return del.status === 204
}

async function main(args) {
  try {

    const accessToken = await provideAccessToken();
    const octo = new (Octokit.plugin(retry))(
      { auth: accessToken,
        // also retry after 404, as this actually happened
        retry: {doNotRetry: [400, 401, 403, 422]}
      });
    const auth = await getAuthenticated(octo);
    if(auth.status === 401){
      return;
    }
    const login = auth.data.login;

    let forkUrl = await findForkOf(octo, login, TMPL_OWNER, TMPL_REPO);
    if(forkUrl){
      console.error(`Repo ${TMPL_REPO} already forked to ${forkUrl}`);
      let deleted = false;
      if(args.includes('--force')){
        deleted = await deleteFork(octo, forkUrl);
      }
      if(!deleted){
        return;
      }
    }
    const response = await prompts(QUESTIONS, { onSubmit: logPrompt });
    if (!response[Q_CONFIRM]) {
      return;
    }
    const repoName = response[Q_REPO_NAME];
    const siteUrl = response[Q_SITE_URL];
    const description = response[Q_DESCRIPTION];
    const homepage = siteUrl ? `https://${siteUrl}` : '';
    const topics = response[Q_TOPICS];

    console.log('Starting fork');
    await forkRepo(octo, TMPL_OWNER, TMPL_REPO);

    const updateProps = {
      name: repoName, has_issues: true,
      description, homepage
    };
    await updateRepo(octo, login, TMPL_REPO, updateProps);
    await replaceAllTopics(octo, login, repoName, topics);

    await deleteAllIssueLabels(octo, login, repoName);

    const labels = await listIssueLabels(octo, TMPL_OWNER, TMPL_REPO);
    await createIssueLabels(octo, login, repoName, labels.data);

    const issues = await listIssues(octo, TMPL_OWNER, TMPL_REPO);
    const clonedIssues = issues.data.reverse().map(cloneIssueData);
    await createIssues(octo, login, repoName, clonedIssues);

  } catch (error) {
    logger.error('error', { error });
    console.error(error?.response?.data?.message || error);
  }
}

try {
  main(process.argv.slice(2));
} catch (error) {
  logger.error('error', { error });
  console.error(error);
}
