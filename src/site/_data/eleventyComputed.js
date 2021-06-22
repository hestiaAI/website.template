const getLocales = (data) =>
      data.collections.locales[data.page.inputPath];

const findLocale = (data) =>
      getLocales(data) && getLocales(data).locale;

const findTranslations = (data) =>
      getLocales(data) && getLocales(data).translations;

const findDefaultTranslation = (data) =>
      getLocales(data) && getLocales(data).defaultTranslation;

const findPostAttributes = (data, attributeName) => {
    // this is only relevant for posts
    if(!data.tags || !data.tags.includes('post')){ return undefined; }

    // Concatenate tags of all translations of this post.
    // in case netlifyCMS only stores the attribute on the default translation.
    // At least some versions of the cms do this.
    const locales = getLocales(data);
    const own_post_attr = data[attributeName] || [];
    if(!locales){return own_post_attr;}
    const attrsOfTranslated =
          locales.translations
                 .filter(t => t && t.page.data[attributeName])
                 .map(t => t.page.data[attributeName]);
    const attrsOfAllTranslations = attrsOfTranslated.reduce(
        (concats, tags) => concats.concat(tags), own_post_attr);
    const tagSet = new Set(attrsOfAllTranslations);
    return [...tagSet];
};

const findId = (data) => {
  if(data.id){ return data.id; }
  const defaultTranslation = findDefaultTranslation(data);
  if(defaultTranslation){
    return defaultTranslation.page.data.id;
  }
  return data.id;
};

const omitSomeEleventySuppliedData = data => {
  // declare dependencies
  // https://www.11ty.dev/docs/data-computed/#declaring-your-dependencies
  data.defaultTranslation
  const {pkg, collections, eleventyComputed, ...cosher} = data;
  return cosher;
}


// https://www.11ty.dev/docs/data-computed/
// It is important to note that Computed Data is computed
// right before templates are rendered. Therefore Computed Data
// cannot be used to modify the special data properties used
// to configure templates (e.g. layout, pagination, tags etc.).
module.exports = {
  locale: findLocale,
  defaultTranslation: findDefaultTranslation,
  translations: findTranslations,
  // post_categories: findPostCategories,
  post_categories: data => findPostAttributes(data, 'post_categories'),
  post_authors: data => findPostAttributes(data, 'post_authors'),
  id: findId,
  pageData: data => omitSomeEleventySuppliedData(data)
}
