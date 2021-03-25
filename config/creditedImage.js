function creditedImage(href, alt, title, credits) {
    var caption = credits ? `copyright ${credits}` : '';
    return `<div><img src="${href}" alt="${alt}" title="${title}" ><div>${caption}</div></div>`;
}

module.exports = { creditedImage };
