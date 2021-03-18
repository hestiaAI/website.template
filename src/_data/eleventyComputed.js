// the locales in admin/config.yml must all be here
const locales = ["en", "fr"]
const localeRegex = new RegExp(`\/(${locales.join('|')})\/`);
const defaultLocale = 'en';

const determineLocale = (page) => {
    const matches = localeRegex.exec(page.inputPath);
    return matches && matches[1] ? matches[1] : defaultLocale;
};

const determineTranslationKey = (page) => {
    const locale = determineLocale(page);
    return page.url.replace(locale+'/', '');
};
// inpired by
// https://www.webstoemp.com/blog/language-switcher-multilingual-jamstack-sites/
const findTranslations = (data) => {
    const pageLocale = determineLocale(data.page);
    const pageKey = determineTranslationKey(data.page);
    return data.collections.all
               .map(p => ({locale: determineLocale(p),
                           url: p.url,
                           key: determineTranslationKey(p)}))
               .filter(t => t.locale != pageLocale && t.key == pageKey)
               .sort();
};

module.exports = {
    locale: data => determineLocale(data.page),
    translations: findTranslations
}
