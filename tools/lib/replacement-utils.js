const replace = require('replace-in-file');
const path = require('path');
const {loggers, format, transports} = require('winston');

// a logger for several modules
// https://github.com/winstonjs/winston/issues/1275
const SETUP_LOGGER_NAME = 'setup-logger';
const logFile = path.join(process.cwd(),'setup-post-fork.log');
console.log(`Logs are written to ${logFile}`);
loggers.add(SETUP_LOGGER_NAME, {
  format: format.simple(),
  transports: [new transports.File({ filename: logFile, handleExceptions: true })]
});

const logger = loggers.get(SETUP_LOGGER_NAME);

async function findMatchingFiles(regexes, paths){
  // see https://github.com/adamreisnz/replace-in-file#basic-usage
  const options = {
    files: paths,
    from: regexes,
    to: '<:o)',
    dry: true
  };
  const results = await replace(options);
  const files = results.filter(result => result.hasChanged)
    .map(result => result.file);
  return files;
}

async function replaceRegexes(regexes, values, paths){
  // see https://github.com/adamreisnz/replace-in-file#basic-usage
  const options = {
    files: paths,
    from: regexes,
    to: values,
  };
  regexes.forEach((p, i) => {
    const message = `replacing ${p} with "${values[i]}"`;
    console.log(message);
    logger.info(message);
  });
  const results = await replace(options);
  const files = results.filter(result => result.hasChanged)
    .map(result => result.file);
  if (files.length > 0) {
    console.log(`replaced ${regexes.length} regexes`,
      `in ${files.length} files`);
  }
  files.forEach(f => {
    console.log(`wrote ${f}`);
    logger.info(`replaced ${regexes.join(' ')} in ${f}`);
  });
  return files;
}

module.exports = {
  SETUP_LOGGER_NAME,
  findMatchingFiles,
  replaceRegexes
};
