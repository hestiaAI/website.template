/* eslint-env node */
function backgroundImage(imageUrl) {
    const backgroundImageCSSProperty = imageUrl && `background-image: url('${imageUrl}');`
    return backgroundImageCSSProperty;
}

module.exports = { backgroundImage };