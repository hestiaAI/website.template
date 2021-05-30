var {Liquid} = require('liquidjs');
var engine = new Liquid();

function extractAttribute(attributeName, data) {
    const attribute = data[attributeName];
    if(typeof attribute === 'string'){
        return attribute;
    }
    if(attribute?.path){
        const pathArray = attribute.path.split('.');
        return pathArray.reduce((o, attr)=> o[attr], data);
    }
    return undefined;
}

function renderLiquid(attributeName, data) {
    if (data[attributeName] === undefined) {
        console.error(`page ${data.page.inputPath} does not have an attribute "${attributeName}"`);
        return undefined;
    }
    const template = extractAttribute(attributeName, data);
    // make this a sync tag or else it can't be used
    // inside a paired nunjucks shortcode
    // https://github.com/11ty/eleventy/issues/1053
    const rendered = engine.parseAndRenderSync(template, data);
    return rendered;
}

module.exports = { renderLiquid };
