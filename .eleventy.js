// Eleventy configuration file
// https://www.11ty.dev/docs/config/
/* eslint-env node */

const { buildLocalesCollection} = require('./conf/11ty/locales');
const { creditedImage } = require('./conf/11ty/creditedImage')

module.exports = function (eleventyConfig) {
  // Copy to `dir.output` those files required by the website,
  // but not recognized by Eleventy as valid template files.
  // Note: Passthrough File Copy entries are relative to the root
  // of the project and not Eleventy `dir.input` directory.
  eleventyConfig.addPassthroughCopy("src/static/css");
  eleventyConfig.addPassthroughCopy("src/static/img");
  eleventyConfig.addPassthroughCopy("src/admin/*.js");
  eleventyConfig.addPassthroughCopy({ "conf/netlifycms/config.yml": "admin/config.yml" });

  eleventyConfig.addCollection("locales", buildLocalesCollection);

  eleventyConfig.addNunjucksShortcode("creditedImage", creditedImage);

  // Let Eleventy transform HTML files as Nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      output: "build/11ty",
      input: "src",
      data: "_data",            // (default value) relative to `dir.input`
      includes: "_includes",    // (default value) relative to `dir.input`
      layouts:  "_includes",    // (default value) relative to `dir.input`
    },
    // templateFormats: ["html", "md", "njk"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};