const prompts = require('prompts');
const replace = require('replace-in-file');

// const pino = require('pino');
const path = require('path');
const {createLogger, format, transports} = require('winston');

const logFile = path.join(process.cwd(),'setup-post-fork.log');
console.log(`Logs are written to ${logFile}`);
const logger = createLogger({
  format: format.simple(),
  transports: [new transports.File({ filename: logFile, handleExceptions: true })]
});

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

const requiredValidator =
      value => value.length > 0 || 'Please enter a value';

const urlPartValidator = value => {
  if(encodeURIComponent(value) != value){
    return `The name should be valid in an url`
  }
  return true;
};

const urlValidator = value => {
  // not mandatory
  if(!value){return true;}
  try {
    new URL('http://' + value);
    return true;
  } catch (error) {
    return "Invalid url";
  }
};

const twitterValidator = value =>
      value.startsWith('@') ? 'Please remove the @' : true;

const composeValidators = (...validators) => (value) =>
  validators.reduce(
    (result, validator) => result === true ? validator(value) : result,
    true);

const questions = [
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
    validate: twitterValidator
  },
  {
    type: 'text',
    name: P_FORUM_SITE_URL,
    message: 'URL of the forum',
    validate: urlValidator
  }
  //TODO last input asks to run replacement script
];

const deriveValues = (vals, derivations) =>
      Object.entries(vals).reduce(
        (allVals, [ph, val] ) => {
          if (val) {
            derivations[ph]?.forEach(d => {
              allVals[d.name] = d.derive(val);
            })
          }
          return allVals;
        },
        Object.assign({}, vals));

async function findPlaceholderFiles(placeholders, paths){
  // see https://github.com/adamreisnz/replace-in-file#basic-usage
  const options = {
    files: paths,
    from: placeholders.map(p => new RegExp(p, 'g')),
    to: '<:o)',
    dry: true
  };
  const results = await replace(options);
  const files = results.filter(result => result.hasChanged)
    .map(result => result.file);
  return files;
}

async function replacePlaceholders(placeholders, values, paths){
  // see https://github.com/adamreisnz/replace-in-file#basic-usage
  const options = {
    files: paths,
    from: placeholders.map(p => new RegExp(p, 'g')),
    to: values,
  };
  placeholders.forEach((p, i) => {
    const message = `replacing ${p} with "${values[i]}"`;
    console.log(message);
    logger.info(message);
  });
  const results = await replace(options);
  const files = results.filter(result => result.hasChanged)
    .map(result => result.file);
  console.log(`replaced ${placeholders.length} placeholders`,
    ` in ${files.length} files`);
  files.forEach(f => {
    console.log(`wrote ${f}`);
    logger.info(`replaced ${placeholders.join(' ')} in ${f}`);
  });
  return files;
}

async function placeholderTodos(placeholders, derivations, path){
  const filesToProcess = await Promise.all(placeholders.map(p => {
    const derived = derivations[p]?.map(d => d.name) || [];
    return findPlaceholderFiles(derived.concat(p), path);
  }));
  return placeholders.reduce(
    (partition, p, i) => {
      const done = filesToProcess[i].length === 0;
      partition[done ? 'done' : 'todo'].push(p);
      return partition;
    },
    { todo: [], done: [] });
}

const main = async () => {
  console.log();
  console.log("This script changes files by replacing placeholders with values that you choose.")
  console.log("It will not replace the placeholders for which you give no value.")
  console.log("Run the script again to replace remaining placeholders.")
  const placeholders =
        await placeholderTodos(SOURCE_PLACEHOLDERS, DERIVATIONS, TARGET_PATHS);
  if(placeholders.done.length > 0){
    logger.info(`placeholders not found in files ${placeholders.done.join(' ')}`);
    console.log('The following placeholders have already been replaced:\n',
                placeholders.done.join('\n'));
  }
  logger.info(`unreplaced placeholders ${placeholders.todo.join(' ')}`);
  const unanswered = questions.filter(
    q => placeholders.todo.includes(q.name));
  const response = await prompts(unanswered, {
    onSubmit: (prompt, answer) => {
      try{
        logger.info(`user chooses ${prompt.name} = ${answer}`);
      }catch(error){
        console.error(error);
        logger.error(error);
      }
    }});
  const allValues = deriveValues(response, DERIVATIONS);
  const toReplace  = allPlaceholders(SOURCE_PLACEHOLDERS, DERIVATIONS)
        .filter(p => allValues[p]);
  const replacements = toReplace.map(p => allValues[p]);
  try {
    await replacePlaceholders(toReplace, replacements, TARGET_PATHS, false);
  } catch (error) {
    console.error(error);
    logger.error(error);
  }
};

try {
  main();
} catch (error) {
  console.error(error);
}
/*

- [x] Figure out a title for the new website ⟶ `‹SITE-TITLE›`; _`Your Showcase`_  `DONE`
- [x] Figure out a name for the new website ⟶ `‹SITE-NAME›`; _`your-showcase`_ `DONE`
- [x] Figure out a two letters short name for the new website ⟶ `‹SITE-SHORTNAME›`; _`showcase`_ `DONE`
- [x] Figure out a name for the new repository ⟶ `‹REPO-NAME›`; _`website.showcase` `DONE`

Derived names:

- [x] `‹REPO-PACKAGE-NAME›`⟵ `website-‹SITE-SHORTNAME›` _package name for the new repository, used in `package.json_`; same as ‹REPO-NAME›, but with dash instead of dot: `website-showcase`_
- [x] `‹NEWSLETTER-FORM-NAME›` ⟵ `newsletter-showcase-signup` _name of the Netlify Form to which newsletter subscriptions will be submitted to_
- [x] `‹CONTACT-FORM-NAME-INFO›` ⟵ `contact-showcase-info`
- [x] `‹CONTACT-FORM-NAME-MEDIA›` ⟵ `contact-showcase-media`
- [x] `‹CONTACT-FORM-NAME-PARTNERS›` ⟵ `contact-showcase-partners`
- [x] `‹CONTACT-FORM-NAME-RESEARCHERS›` ⟵ `contact-showcase-researchers`

Optional at this stage, but have to be defined before site public launch:

- [x] Decide an URL for the new website ⟶ `‹SITE-URL›` _to be reserved in Gandi and used in Netlify; for instance, `your-showcase.hestialabs.org`_
- [ ] Get the Netlify Site UUID ⟶ `‹SITE-UUID›` _used in `README.md`_
- [x] Decide who'll be the owner of the community ⟶ `‹SITE-OWNER-NAME›` _used in `package.json`: `Charles Foucault-Dumas`_
- [ ] Decide a Twitter account name linked to the new website ⟶ `‹TWITTER-ACCOUNT-NAME›`
- [ ] Decide an URL for the forum linked to the new website ⟶ `‹FORUM-SITE-URL›`
 */
