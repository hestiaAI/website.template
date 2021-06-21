const {
  findMatchingFiles,
  replaceRegexes,
  SETUP_LOGGER_NAME
} = require('./replacement-utils')
const{hexColorValidator} = require('./prompt-utils');
const {loggers} = require('winston');
const logger = loggers.get(SETUP_LOGGER_NAME)

const REGEX_PRIMARY_COLOR_CSS = /(--theme-color-primary: *)#04650f/
const REGEX_SECONDARY_COLOR_CSS = /(--theme-color-secondary: *)#e4ffef/;
const REGEX_PRIMARY_COLOR_SVG_1 = /(fill=")#04650f/
const REGEX_PRIMARY_COLOR_SVG_2 = /(fill:)rgb\(4,101,15\)/g
const REGEX_SECONDARY_COLOR_SVG = /(fill:)rgb\(228,255,239\)/g;
const PRIMARY_REGEXES = [
  REGEX_PRIMARY_COLOR_CSS,
  REGEX_PRIMARY_COLOR_SVG_1,
  REGEX_PRIMARY_COLOR_SVG_2
];

const SECONDARY_REGEXES = [
  REGEX_SECONDARY_COLOR_CSS,
  REGEX_SECONDARY_COLOR_SVG,
];

const replacingString = hexColor => `$1${hexColor}`;

const TARGET_PATHS = [
  './src/assets/styles/main.css',
  './src/assets/styles/base/variables.css',
  'src/assets/img/icon-external-link.svg',
  'src/assets/img/placeholder-logo-web.export.svg',
  'src/site/favicon.svg'
];

// https://css-tricks.com/snippets/javascript/lighten-darken-color/
function LightenDarkenColor(col, amt) {
    var usePound = false;
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
    var num = parseInt(col,16);
    var r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
    var b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
    var g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}

const Q_PRIMARY_COLOR = 'primaryColor';
const Q_SECONDARY_COLOR = 'secondaryColor';

const COLOR_QUESTIONS = [
  {
    type: 'text',
    name: Q_PRIMARY_COLOR,
    message: 'Choose a primary color, if you want to change it',
    validate: hexColorValidator
  },
  {
    type: prev => prev ? 'text' : false,
    name: Q_SECONDARY_COLOR,
    message: 'Choose a secondary color',
    initial: prev => LightenDarkenColor(prev, 224),
    validate: hexColorValidator
  }
];

async function areColorsReplaced(){
  const regexes = PRIMARY_REGEXES.concat(SECONDARY_REGEXES);
  const filesToProcess = await findMatchingFiles(regexes, TARGET_PATHS);
  return filesToProcess.length === 0;
}

async function replaceColors(response) {
  const primaryCol = response[Q_PRIMARY_COLOR];
  const secondaryCol = response[Q_SECONDARY_COLOR];
  if(!primaryCol || !secondaryCol){
    return;
  }
  const pVals = PRIMARY_REGEXES.map( _ => replacingString(primaryCol));
  const sVals = SECONDARY_REGEXES.map( _ => replacingString(secondaryCol));

  const allRegexes = PRIMARY_REGEXES.concat(SECONDARY_REGEXES);
  const allValues = pVals.concat(sVals);
  try {
    await replaceRegexes(allRegexes, allValues, TARGET_PATHS);
  } catch (error) {
    console.error(error);
    logger.error(error);
  }
};

module.exports = {
  COLOR_QUESTIONS,
  areColorsReplaced,
  replaceColors
};
