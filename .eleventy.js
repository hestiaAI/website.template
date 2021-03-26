// Eleventy configuration file
// https://www.11ty.dev/docs/config/
/* eslint-env node */

const { buildLocalesCollection} = require('./config/locales');
const { creditedImage } = require('./config/creditedImage')

module.exports = function (eleventyConfig) {
  // Copy static files to `dir.output`
  // Note: Passthrough File Copy entries are relative to the root of your project and not your Eleventy input directory
  eleventyConfig.addPassthroughCopy("./src/static/css");
  eleventyConfig.addPassthroughCopy("./src/static/img");
  eleventyConfig.addPassthroughCopy("./src/admin/*js");
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml"
  });

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