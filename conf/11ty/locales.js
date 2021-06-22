/* eslint-env node */
const { DateTime } = require("luxon");

// this must match the CMS locales declared in conf/netlifycms/config.yml
const LOCALES = ["en", "fr"]
const LOCALE_REGEX = new RegExp(`\/(${LOCALES.join('|')})\/`);
const DEFAULT_LOCALE = LOCALES[0];

const determineLocale = (page) => {
  const matches = LOCALE_REGEX.exec(page.inputPath);
  const locale = matches && matches[1] ? matches[1] : DEFAULT_LOCALE;
  return locale;
};

const determineTranslationKey = (page) => {
  const path = page.url || page.inputPath;
  const locale = determineLocale(page);
  return path.replace(locale + '/', '');
};

function buildLocalesCollection(collectionApi) {
    // inpired by
    // https://www.webstoemp.com/blog/language-switcher-multilingual-jamstack-sites/
    const translationsByKey = collectionApi.getAll().reduce(
      (transByKey, page)=>{
        const locale = determineLocale(page);
        const key = determineTranslationKey(page);
        transByKey[key] = transByKey[key] || {};
        const translations = transByKey[key];
        translations[locale] = {locale, page};
        return transByKey;
      },{});
    const localesByPath = Object.values(translationsByKey).reduce(
      (locsByPath, ts) => {
        const defaultTranslation = ts[DEFAULT_LOCALE];
        Object.values(ts).forEach(t => {
          const {locale, page} = t;
          const translations = LOCALES
                // uncomment to ignore current locale
                // .filter(loc => loc != locale )
                .map(loc => ts[loc]);
          locsByPath[page.inputPath] =
            {locale, page, defaultTranslation, translations};
        });
        return locsByPath;
      },{});
    return localesByPath;
}

const formatDate = (date, locale, format) => {
  let parsedDate;
  if(typeof date == 'string'){
    parsedDate = DateTime.fromISO(date, { zone: "utc" });
  } else {
    parsedDate = DateTime.fromJSDate(date, { zone: "utc" });
  }
  const formattedDate = parsedDate
    .setLocale(locale || DEFAULT_LOCALE)
    .toFormat(format || "dd LLLL yyyy");
  return formattedDate;
}

const getLocalizedOrDefault = (data, name) => {
  const localizedVal = data[name];
  const defaultVal = data.defaultTranslation.page.data[name]
  if(Array.isArray(localizedVal)){
    return localizedVal.length > 0 ? localizedVal : defaultVal;
  }
  const localized = localizedVal !== undefined && localizedVal != '';
  return localized ? localizedVal : defaultVal;
}

module.exports = { buildLocalesCollection, formatDate, determineLocale, getLocalizedOrDefault };
