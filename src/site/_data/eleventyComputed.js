const getLocales = (data) =>
      data.collections.locales[data.page.inputPath];

const findLocale = (data) =>
      getLocales(data) && getLocales(data).locale;

const findTranslations = (data) =>
      getLocales(data) && getLocales(data).translations;

const findDefaultTranslation = (data) =>
      getLocales(data) && getLocales(data).defaultTranslation;

const findPostTags = (data) => {
    // this is only relevant for posts
    if(!data.tags || !data.tags.includes('post')){ return undefined; }

    // Concatenate tags of all translations of this post.
    // in case netlifyCMS only stores the tag on the default translation.
    // At least older versions of the cms did this.
    const locales =
          data.collections.locales[data.page.inputPath];
    const own_post_tags = data.post_tags || [];
    if(!locales){return own_post_tags;}
    const tagsOfTranslated =
          locales.translations
                 .filter(t => t && t.page.data.post_tags)
                 .map(t => t.page.data.post_tags);
    const tagsOfAllTranslations = tagsOfTranslated.reduce(
        (concats, tags) => concats.concat(tags), own_post_tags);
    const tagSet = new Set(tagsOfAllTranslations);
    return [...tagSet];
};

// https://www.11ty.dev/docs/data-computed/
// It is important to note that Computed Data is computed
// right before templates are rendered. Therefore Computed Data
// cannot be used to modify the special data properties used
// to configure templates (e.g. layout, pagination, tags etc.).
module.exports = {
    locale: findLocale,
    defaultTranslation: findDefaultTranslation,
    translations: findTranslations,
    post_tags: findPostTags,
}
