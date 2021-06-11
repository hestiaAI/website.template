const prompts = require('prompts');
const replace = require('replace-in-file');

// const pino = require('pino');
const path = require('path');
const {createLogger, format, transports} = require('winston');

const logFile = path.join(process.cwd(),'setup-post-fork.log');
console.log(`logs written to ${logFile}`);
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
    {name: P_NEWSLETTER_FORM_NAME, derive: p => `newletter-${p}-signup`},
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
    message: 'Twitter handle',
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

async function replacePlaceholders(placeholders, value, paths, dry){
  // see https://github.com/adamreisnz/replace-in-file#basic-usage
  const options = {
    files: paths,
    from: placeholders.map(p => new RegExp(p, 'g')),
    to: value,
    dry
  };
  if(!dry){
    const message = `replacing ${placeholders.join(' ')} with ${value}`;
    console.log(message);
    logger.info(message);
  }
  const results = await replace(options);
  const files = results.filter(result => result.hasChanged)
    .map(result => result.file);
  if (!dry) {
    files.forEach(f => {
      const message = `replaced ${placeholders.join(' ')} in ${f}`;
      console.log(message);
      logger.info(message);
    });
  }
  return files;
}

async function placeholderTodos(placeholders, derivations, path){
  const filesToProcess = await Promise.all(placeholders.map(p => {
    const derived = derivations[p]?.map(d => d.name) || [];
    return replacePlaceholders(derived.concat(p), '<:-D', path, true);
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
  const placeholders = await placeholderTodos(SOURCE_PLACEHOLDERS, DERIVATIONS, TARGET_PATHS);
  if(placeholders.done.length > 0){
    logger.info(`placeholders not found in files ${placeholders.done.join(' ')}`);
    console.log('The following placeholders have already been replaced:\n',
                placeholders.done.join('\n'));
  }
  logger.info(`unreplaced placeholders ${placeholders.todo.join(' ')}`);
  const unanswered = questions.filter(q => placeholders.todo.includes(q.name));
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
  allPlaceholders(SOURCE_PLACEHOLDERS, DERIVATIONS)
    .forEach(async (placeholder) => {
      try{
        const value = allValues[placeholder];
        if (value) {
          console.log(`${placeholder} = ${value}`);
          await replacePlaceholders([placeholder], value, TARGET_PATHS, false);
        }
      }catch(error){
        console.error(error);
        logger.error(error);
      }
    });
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
