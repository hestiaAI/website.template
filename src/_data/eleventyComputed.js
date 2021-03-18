// the locales in admin/config.yml must all be here
const localeRegex = /\/(en|fr|de)\//;
const defaultLocale = 'en';
const determineLocale = (data) => {
    const matches = localeRegex.exec(data.page.inputPath);
    return matches && matches[1] ? matches[1] : defaultLocale;
}
module.exports = {
    locale: determineLocale
}
