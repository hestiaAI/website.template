// the locales in admin/config.yml must all be here
const locales = ["en", "fr"]
const localeRegex = new RegExp(`\/(${locales.join('|')})\/`);
const defaultLocale = 'en';

const determineLocale = (page) => {
    const matches = localeRegex.exec(page.inputPath);
    return matches && matches[1] ? matches[1] : defaultLocale;
};

const determineTranslationKey = (page) => {
    if(!page.url) { return page.url; }
    const locale = determineLocale(page);
    return page.url.replace(locale+'/', '');
};

// inpired by
// https://www.webstoemp.com/blog/language-switcher-multilingual-jamstack-sites/
const findTranslations = (data) => {
    const pageLocale = determineLocale(data.page);
    const pageKey = determineTranslationKey(data.page);
    const translations =
          data.collections.all
               .map(page => {
                   const locale = determineLocale(page);
                   return {locale, page,
                           defaultLocale: locale == locales[0],
                           key: determineTranslationKey(page)};
               })
               .filter(t => t.locale != pageLocale && t.key == pageKey)
               .sort((t1,t2) => t1.locale > t2.locale);
    return translations;
};

const findDefaultLocalePostTags = (data) => {
    // https://www.11ty.dev/docs/data-computed/#declaring-your-dependencies
    // We do try our best to automatically detect
    // dependencies between eleventyComputed keys
    if(!data.tags || !data.tags.includes('post')){ return undefined }
    // thank heavens there's a second pass
    if(!data.translations){return data.post_tags; }
    const found =
          data.translations.find(t => t.defaultLocale);
    const foundTags = found ? found.page.data.post_tags : [];
    const tagSet = new Set(foundTags.concat(data.post_tags));
    return [...tagSet];
} ;

const findDefaultLocalePostTagsF = (data) => {
    // https://www.11ty.dev/docs/data-computed/#declaring-your-dependencies
    // We do try our best to automatically detect
    // dependencies between eleventyComputed keys
    if(!data.tags || !data.tags.includes('post')){ return undefined }
    // thank heavens there's a second pass
    if(!data.translations){return data.post_tagsf; }
    const found =
          data.translations.find(t => t.defaultLocale);
    const foundTags = found ? found.page.data.post_tagsf : [];
    const tagSet = new Set(foundTags.concat(data.post_tagsf));
    console.log('p',data.title, data.locale, [...tagSet])
    return [...tagSet];
} ;
// https://www.11ty.dev/docs/data-computed/
// It is important to note that Computed Data is computed
// right before templates are rendered. Therefore Computed Data
// cannot be used to modify the special data properties used
// to configure templates (e.g. layout, pagination, tags etc.).
module.exports = {
    locale: data => determineLocale(data.page),
    translations: findTranslations,
    post_tags: findDefaultLocalePostTags,
    post_tagsf: findDefaultLocalePostTagsF
}

// module.exports = {
//     locale: data => determineLocale(data.page),
//     translations: findTranslations
// }
