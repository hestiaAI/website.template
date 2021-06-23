#!/usr/bin/env node
require('./lib/check-runtime-env').assertNodeVersion();
const prompts = require('prompts');
const {
  findMatchingFiles,
  replaceRegexes,
  SETUP_LOGGER_NAME
} = require('./lib/replacement-utils');

const replace = require('replace-in-file');
const {loggers} = require('winston');
const logger = loggers.get(SETUP_LOGGER_NAME)

const Q_CONFIRM = 'confirm';

const TARGET_PATHS = [
  'src/site/blog/editorial/**/*.md',
  'src/site/blog/interview/**/*.md',
  'src/site/blog/infographic/**/*.md',
  'src/site/home/**/*.md'];

const REGEXES = [/( +)(editorial|interview|infographic): /g];
const REPLACEMENTS = '$1post: ';
async function main() {
  const filesToProcess = await findMatchingFiles(REGEXES, TARGET_PATHS);
  if(filesToProcess.length === 0){
    console.log('No files to replace');
    logger.info('No files to replace');
    return
  }else{
    console.log('Matching files:')
    filesToProcess.forEach(f => console.log(`- ${f}`));
  }
  const response = await prompts({
    type: 'confirm',
    name: Q_CONFIRM,
    message: 'Migrate these files ?',
  });
  if(!response[Q_CONFIRM]){
    return;
  }
  try {
    await replaceRegexes(REGEXES, REPLACEMENTS, TARGET_PATHS);
  } catch (error) {
    console.error(error);
    logger.error(error);
  }
};

try {
  main();
} catch (error) {
  logger.error(error);
  console.error(error);
}
