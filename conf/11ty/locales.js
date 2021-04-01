
/* eslint-env node */

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
    if(!page.url) { return page.inputPath; }
    const locale = determineLocale(page);
    return page.url.replace(locale+'/', '');
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
                .filter(loc => loc != locale )
                .map(loc => ts[loc]);
          locsByPath[page.inputPath] =
            {locale, page, defaultTranslation, translations};
        });
        return locsByPath;
      },{});
    return localesByPath;
}

module.exports = { buildLocalesCollection };
