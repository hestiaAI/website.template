//https://www.netlifycms.org/docs/custom-widgets/
function extractCredits(src) {
    var match = src && src.match(/-c-(.*)-c-/);
    if(!match) { return ''; }
    var credits = match[1];
    return credits.split('-')
                  .map(n => n.charAt(0).toUpperCase() + n.slice(1))
                  .join(' ');
}


CMS.registerEditorComponent({
    // Internal id of the component
    id: "credited-image",
    // Visible label
    label: "Credited image",
    // Fields the user need to fill out when adding an instance of the component
    fields: [{name: 'src', label: 'Image (credits in file name, ex: bla-c-cartier-bresson-c-.jpg )', widget: 'image'},
             {name: 'alt', label: 'Alternative text', widget: 'string'},
             {name: 'title', label: 'Title', widget: 'string'}
            ],
    // Pattern to identify a block as being an instance of this component
    // {% raw %} ignore this, nunjucks
    pattern: /^{% creditedImage "([^"]*)", "([^"]*)", "([^"]*)", "[^"]*" %}$/,
    // {% endraw %}
    // Function to extract data elements from the regexp match
    fromBlock: function(match) {
        return {
            src: match[1],
            alt: match[2],
            title: match[3]
        };
    },
    // Function to create a text block from an instance of this component
    toBlock: function(obj) {
        var credits = extractCredits(obj.src);
        //{% raw %}
        return `{% creditedImage "${obj.src}", "${obj.alt}", "${obj.title}", "${credits}" %}`;
        //{% endraw %}
    },
    // Preview output for this component. Can either be a string or a React component
    // (component gives better render performance)
    toPreview: function(obj) {
        return (
            `<div><img src="${obj.src}" "/><div></div></div>`
        );
    }
});
