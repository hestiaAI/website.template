function mapTranslationObject(translations) {
  return translations.reduce((a, v) => ({ ...a, [v.languages_code.slice(0, 2)]: v}), {})
}

async function fetchUseCases(directus) {
  const response = await directus.items("hestiaai_use_cases").readByQuery({
    fields: ["*", "translations.*", "related_content.Content_id.*", "related_content.Content_id.translations.*"], //  "translations.*", "related_content.related_Content_id.*", "related_content.related_Content_id.translations.*"
    filter: {
      status: {
        _eq: 'draft' // replace with published in production
      }
    }
  });

  if(!response.data) {
    throw Error('Unable to fetch data from Directus')
  }
  
  const data = response.data
  console.log(data)
  const results = {
    ...data,
    translations: mapTranslationObject(data.translations),
    related_content: data.related_content.map(r => {
      console.log(r)
      return {
        ...(r.Content_id),
        translations: mapTranslationObject(r.Content_id.translations)
      }
    })
  }
  return results;
}

module.exports = async function ({ directus }) {
  console.log('Fetching Use cases: \n')
  const usecases = await fetchUseCases(directus)
  console.log('result: ', usecases, '\n')

  return {
    usecases
  }
};