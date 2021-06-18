
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

const twitterNoAmpersandValidator = value =>
      value.startsWith('@') ? 'Please remove the @' : true;

const hexColorValidator = value => {
  if(value === ''){
    return true; //not required
  }
  if (/^#[0-9A-Fa-f]{6}$/i.test(value)) {
    return true;
  } else {
    return 'Color needs to be in hex format (#rrggbb)';
  }
};

const composeValidators = (...validators) => (value) =>
  validators.reduce(
    (result, validator) => result === true ? validator(value) : result,
    true);

function makeLogPrompt(logger) {
  return (prompt, answer) => {
    try {
      const isSecret = ['password', 'invisible'].includes(prompt.type);
      const loggedAnswer = isSecret ? '*****' : answer;
      logger.info(`user chooses ${prompt.name} = ${loggedAnswer}`);
    } catch (error) {
      console.error(error);
      logger.error(error);
    }
  };
}

module.exports = {
  requiredValidator,
  urlPartValidator,
  urlValidator,
  twitterNoAmpersandValidator,
  hexColorValidator,
  composeValidators,
  makeLogPrompt
}
