// Eleventy configuration, integrated with Snowpack
// https://www.11ty.dev/docs/config/
/* eslint-env node */

const { buildLocalesCollection, formatDate, getLocalizedOrDefault} =
      require('./conf/11ty/locales');
const { buildPosts } = require('./conf/11ty/blogPosts');
const { backgroundImage } = require('./conf/11ty/backgroundImage')
const { creditedImage } = require('./conf/11ty/creditedImage')
const { contactUrl } = require('./conf/11ty/contactUrl')
const { internalLink } = require('./conf/11ty/internalLink')
const { renderLiquid } = require('./conf/11ty/liquid')
const {inlineMarkdownPairedShortCode, inlineMarkdownShortCode, markdownShortCode, markdownIt} = require('./conf/11ty/markdown');

module.exports = function (eleventyConfig) {

  // Copy to `dir.output` those files required by the website,
  // but not recognized by Eleventy as valid template files.
  // Note: Passthrough File Copy entries are relative to the root
  // of the project and not Eleventy `dir.input` directory.
  eleventyConfig.addPassthroughCopy({"src/admin": "admin"});
  eleventyConfig.addPassthroughCopy({"src/assets": "assets"});
  eleventyConfig.addPassthroughCopy({"src/site/_data/i18n/assets/": "assets/i18n" });
  eleventyConfig.addPassthroughCopy({"src/site/_data/data/assets/": "assets/data" });
  eleventyConfig.addPassthroughCopy("src/site/favicon*");
  eleventyConfig.addPassthroughCopy("src/site/manifest.json");
  eleventyConfig.addPassthroughCopy("src/site/robots.txt");
  eleventyConfig.addPassthroughCopy({"conf/netlify/cms/config.yml": "admin/config.yml" });
  eleventyConfig.addPassthroughCopy({ "conf/netlify/forms/*.html": "admin/forms/" });

  eleventyConfig.addCollection("locales", buildLocalesCollection);
  eleventyConfig.addCollection("blogPosts", buildPosts);

  eleventyConfig.addFilter("getLocalizedOrDefault", getLocalizedOrDefault);
  eleventyConfig.addFilter("readableDate", formatDate);
  eleventyConfig.addFilter("backgroundImage", backgroundImage);
  eleventyConfig.addShortcode("creditedImage", creditedImage);
  eleventyConfig.addShortcode("contactUrl", contactUrl);
  eleventyConfig.addPairedShortcode("ilink", internalLink);
  eleventyConfig.addShortcode("markdown", (s) => markdownShortCode(s||''));
  eleventyConfig.addShortcode("inlineMarkdown", inlineMarkdownShortCode);
  eleventyConfig.addPairedShortcode("inlineMarkdownP", inlineMarkdownPairedShortCode);
  eleventyConfig.addShortcode("renderLiquid", renderLiquid);

  // Use the same markdown instance as the shortcodes
  // to prevent behaviorial differences coming from
  // 11ty's own default markdown library
  eleventyConfig.setLibrary("md", markdownIt);

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
    // don't preprocess global data.
    dataTemplateEngine: false
  };
};
