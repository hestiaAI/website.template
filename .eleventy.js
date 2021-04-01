// Eleventy configuration, integrated with Snowpack
// https://www.11ty.dev/docs/config/
/* eslint-env node */

const { buildLocalesCollection} = require('./conf/11ty/locales');
const { creditedImage } = require('./conf/11ty/creditedImage')
const { markdown } = require('./conf/11ty/markdown')
const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // Copy to `dir.output` those files required by the website,
  // but not recognized by Eleventy as valid template files.
  // Note: Passthrough File Copy entries are relative to the root
  // of the project and not Eleventy `dir.input` directory.
  eleventyConfig.addPassthroughCopy("src/site/assets");
  eleventyConfig.addPassthroughCopy("src/site/admin/*.js");
  eleventyConfig.addPassthroughCopy({ "conf/netlifycms/config.yml": "admin/config.yml" });

  eleventyConfig.addCollection("locales", buildLocalesCollection);

  eleventyConfig.addFilter("readableDate", (dateObj) =>
    DateTime.fromJSDate(dateObj, { zone: "utc" })
            .toFormat("dd LLL yyyy")
  );
  eleventyConfig.addNunjucksShortcode("creditedImage", creditedImage);
  eleventyConfig.addNunjucksShortcode("markdown", markdown);

  // Let Eleventy transform HTML files as Nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      output: "build/11ty",     // linked to Snowpack `mount` setting
      input: "src/site",
      data: "_data",            // (default value) relative to `dir.input`
      includes: "_includes",    // (default value) relative to `dir.input`
      layouts:  "_layouts",     // (overrides default) still relative to `dir.input`
    },
    // templateFormats: ["html", "md", "njk"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
