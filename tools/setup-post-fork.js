#!/usr/bin/env node
const prompts = require('prompts');
const {
  findMatchingFiles,
  replaceRegexes,
  SETUP_LOGGER_NAME
} = require('./lib/replacement-utils');
const{
  urlPartValidator,
  urlValidator,
  twitterNoAmpersandValidator,
  makeLogPrompt,
} = require('./lib/prompt-utils');
const {
  COLOR_QUESTIONS,
  areColorsReplaced,
  replaceColors
} = require('./lib/replace-colors');
const { assertNodeVersion } = require('./lib/check-runtime-env');
const {loggers} = require('winston');
const logger = loggers.get(SETUP_LOGGER_NAME)

const P_SITE_TITLE = '‹SITE-TITLE›';
const P_SITE_NAME = '‹SITE-NAME›';
const P_SITE_SHORTNAME = '‹SITE-SHORTNAME›';
const P_REPO_NAME = '‹REPO-NAME›';
const P_REPO_PACKAGE_NAME = '‹REPO-PACKAGE-NAME›';
const P_NEWSLETTER_FORM_NAME = '‹NEWSLETTER-FORM-NAME›';
const P_CONTACT_FORM_NAME_INFO = '‹CONTACT-FORM-NAME-INFO›';
const P_CONTACT_FORM_NAME_MEDIA = '‹CONTACT-FORM-NAME-MEDIA›';
const P_CONTACT_FORM_NAME_PARTNERS = '‹CONTACT-FORM-NAME-PARTNERS›';
const P_CONTACT_FORM_NAME_RESEARCHERS = '‹CONTACT-FORM-NAME-RESEARCHERS›';
const P_SITE_URL = '‹SITE-URL›';
const P_SITE_UUID = '‹SITE-UUID›';
const P_SITE_OWNER_NAME = '‹SITE-OWNER-NAME›';
const P_TWITTER_ACCOUNT_NAME = '‹TWITTER-ACCOUNT-NAME›';
const P_FORUM_SITE_URL = '‹FORUM-SITE-URL›';
const Q_CONFIRM = 'confirm';

const SOURCE_PLACEHOLDERS = [
  P_SITE_TITLE,
  P_SITE_NAME,
  P_SITE_SHORTNAME,
  P_REPO_NAME,
  P_SITE_URL,
  P_SITE_UUID,
  P_SITE_OWNER_NAME,
  P_TWITTER_ACCOUNT_NAME,
  P_FORUM_SITE_URL];

const DERIVATIONS = {
  [P_SITE_SHORTNAME]: [
    {name: P_REPO_PACKAGE_NAME, derive: p => `website-${p}`},
    {name: P_NEWSLETTER_FORM_NAME, derive: p => `newsletter-${p}-signup`},
    {name: P_CONTACT_FORM_NAME_INFO, derive: p => `contact-${p}-info`},
    {name: P_CONTACT_FORM_NAME_MEDIA, derive: p => `contact-${p}-media`},
    {name: P_CONTACT_FORM_NAME_PARTNERS, derive: p => `contact-${p}-partners`},
    {name: P_CONTACT_FORM_NAME_RESEARCHERS, derive: p => `contact-${p}-researchers`},
  ]
};

const allPlaceholders = (sourcePlaceholders, derivations) =>
      [ ...sourcePlaceholders,
        ...sourcePlaceholders
          .map(p => derivations[p]?.map(d => d.name))
          .filter(ds => ds)
          .flat()]

const TARGET_PATHS = ['src/**', 'conf/**', 'README.md', 'package.json'];

const makeDerivedInitial = (derivedPlaceholder, srcPlaceholder) =>
  (_, vals) => {
    const srcValue = vals[srcPlaceholder];
    const derivation = DERIVATIONS[srcPlaceholder].find(
      d => d.name === derivedPlaceholder);
    if (srcValue && derivation?.derive) {
      return derivation.derive(srcValue);
    }
    return '';
  };

const PLACEHOLDER_QUESTIONS = [
  {
    type: 'text',
    name: P_SITE_TITLE,
    message: 'Title of the website (ex: "Your Showcase")',
  },
  {
    type: 'text',
    name: P_SITE_NAME,
    message: 'Name of the website (ex: "your-showcase")',
    validate: urlPartValidator
  },
  {
    type: 'text',
    name: P_SITE_SHORTNAME,
    message: 'A short name for the website (ex: "shoca")',
  },
  {
    type: 'text',
    name: P_REPO_PACKAGE_NAME,
    message: 'Package name (ex: "website-shoca")',
    // A derived value must come after its source placeholder,
    // so that it can be derived from the user's input for the source.
    initial: makeDerivedInitial(P_REPO_PACKAGE_NAME, P_SITE_SHORTNAME),
  },
  {
    type: 'text',
    name: P_NEWSLETTER_FORM_NAME,
    message: 'Newsletter form name (ex: "newsletter-shoca-signup")',
    initial: makeDerivedInitial(P_NEWSLETTER_FORM_NAME, P_SITE_SHORTNAME),
  },
  {
    type: 'text',
    name: P_CONTACT_FORM_NAME_INFO,
    message: 'Default contact form name (ex: "contact-shoca-info")',
    initial:
    makeDerivedInitial(P_CONTACT_FORM_NAME_INFO, P_SITE_SHORTNAME),
  },
  {
    type: 'text',
    name: P_CONTACT_FORM_NAME_MEDIA,
    message: 'Media contact form name (ex: "contact-shoca-media")',
    initial:
    makeDerivedInitial(P_CONTACT_FORM_NAME_MEDIA, P_SITE_SHORTNAME),
  },
  {
    type: 'text',
    name: P_CONTACT_FORM_NAME_PARTNERS,
    message: 'Partner contact form name (ex: "contact-shoca-partners")',
    initial:
    makeDerivedInitial(P_CONTACT_FORM_NAME_PARTNERS, P_SITE_SHORTNAME),
  },
  {
    type: 'text',
    name: P_CONTACT_FORM_NAME_RESEARCHERS,
    message: 'Researcher contact form name (ex: "contact-shoca-researchers")',
    initial:
    makeDerivedInitial(P_CONTACT_FORM_NAME_RESEARCHERS, P_SITE_SHORTNAME),
  },
  {
    type: 'text',
    name: P_REPO_NAME,
    message: 'Name of the github repo (ex: "website.showcase")',
  },
  {
    type: 'text',
    name: P_SITE_URL,
    message: 'URL of the website (ex: "your-showcase.hestialabs.org")',
    validate: urlValidator
  },
  {
    type: 'text',
    name: P_SITE_UUID,
    message: 'Netlify Site UUID (the API ID set by netlify when the site is configured)',
  },
  {
    type: 'text',
    name: P_SITE_OWNER_NAME,
    message: 'Name of the site owner (used in package.json)',
  },
  {
    type: 'text',
    name: P_TWITTER_ACCOUNT_NAME,
    message: 'Twitter handle (without @)',
    validate: twitterNoAmpersandValidator
  },
  {
    type: 'text',
    name: P_FORUM_SITE_URL,
    message: 'URL of the forum',
    validate: urlValidator
  }
];

const CONFIRM_QUESTION = {
  type: 'confirm',
  name: Q_CONFIRM,
  message: 'Run script to replace placeholders in files ?',
};

const makeRegex = p => new RegExp(p, 'g');

async function placeholderTodos(){
  // const placeholders = SOURCE_PLACEHOLDERS;
  const placeholders = allPlaceholders(SOURCE_PLACEHOLDERS, DERIVATIONS);
  const derivations = DERIVATIONS;
  const paths = TARGET_PATHS;
  const filesToProcess = await Promise.all(placeholders.map(p => {
    const derived = derivations[p]?.map(d => d.name) || [];
    return findMatchingFiles(derived.concat(p).map(makeRegex), paths);
  }));
  return placeholders.reduce(
    (partition, p, i) => {
      const done = filesToProcess[i].length === 0;
      partition[done ? 'done' : 'todo'].push(p);
      return partition;
    },
    { todo: [], done: [] });
}

async function replacePlaceHolders(response) {
  // const allValues = deriveValues(response, DERIVATIONS);
  const allValues = response;
  const toReplace = allPlaceholders(SOURCE_PLACEHOLDERS, DERIVATIONS)
    .filter(p => allValues[p]);
  const replacements = toReplace.map(p => allValues[p]);
  try {
    await replaceRegexes(
      toReplace.map(makeRegex), replacements, TARGET_PATHS, false);
  } catch (error) {
    console.error(error);
    logger.error(error);
  }
};

async function main() {
  console.log();
  ["Change files by replacing placeholders with values that you choose.",
    "The placeholders for which you give no value will not be replaced.",
    "Run the script again to replace remaining placeholders."]
    .forEach(t => console.log(t));
  const placeholders = await placeholderTodos();
  if(placeholders.done.length > 0){
    logger.info(`placeholders not found in files ${placeholders.done.join(' ')}`);
    console.log(
      'The following placeholders have already been replaced:\n' +
      placeholders.done.join('\n'));
  }
  const colorsDone = await areColorsReplaced();
  if(colorsDone){
    console.log("The theme colors have already been set.")
  }
  logger.info(`unreplaced placeholders ${placeholders.todo.join(' ')}`);
  const unanswered = PLACEHOLDER_QUESTIONS
        .filter(q => placeholders.todo.includes(q.name))
        .concat(colorsDone ? [] : COLOR_QUESTIONS)
        .concat([CONFIRM_QUESTION]);
  const response =
        await prompts(unanswered, { onSubmit: makeLogPrompt(logger) });
  const confirm = response[Q_CONFIRM];
  if(confirm){
    await replacePlaceHolders(response);
    await replaceColors(response);
  }
};

try {
  assertNodeVersion('v14');
  main();
} catch (error) {
  logger.error(error);
  console.error(error);
}
