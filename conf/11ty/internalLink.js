/* eslint-env node */

function internalLink(content, page, destination, destinationLocale) {
    let href = destination;
    const hasAnchor = href.match(/#[^/]*$/);
    if(destinationLocale) {
        href = `/${destinationLocale}/${destination}`;
        if(!hasAnchor) {
            href += '/';
        }
    }
    const hrefWithoutAnchor =
          href.match(/(^\/.*?[^/]\/)(#\w+)?$/)[1] ;
    const isCurrent = page.url === hrefWithoutAnchor;
    const ariaCurrent = isCurrent ? ' aria-current="page"' : '';
    return `<a href="${href}"${ariaCurrent}>${content}</a>`;
}

module.exports = { internalLink };