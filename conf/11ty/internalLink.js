/* eslint-env node */

function internalLink(content, page, destination, destinationLocale) {
    let href = destination;
    if(destinationLocale){
        href = `/${destinationLocale}/${destination}/`;
    }
    const ariaCurrent =
          page.url == href ? ' aria-current="page"' : '';
    return `<a href="${href}"${ariaCurrent}>${content}</a>`;
}

module.exports = { internalLink };
