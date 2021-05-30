/* eslint-env node */

function creditedImage(href, alt, title, credits) {
    var caption = credits || '';
    return `<figure><img src="${href}" alt="${alt}" title="${title}" ><figcaption>${caption}</figcaption></figure>`;
}

module.exports = { creditedImage };
