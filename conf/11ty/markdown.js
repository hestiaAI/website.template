// https://github.com/11ty/eleventy/issues/658#issuecomment-599142642
let markdownIt = require("markdown-it")({
  html: true
});

function markdown(content){
    // How to make all links open a new tab:
    // https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
    return markdownIt.render(content);
}

module.exports = { markdown };
