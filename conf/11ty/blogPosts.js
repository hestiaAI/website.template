const {determineLocale} = require("./locales")

function determinePostType(post){
    for(type of ['editorial', 'interview', 'infographic'] ){
        if(post.data.tags.includes(type)){
            return type;
        }
    }
}

/** Return blogposts in reverse chronological order as
 * {[locale]: {latest: [],
 *             editorial: [],
 *             interview: [],
 *             infographic: []}}
 * "latest" contains the four most recent posts,
 * the others are listed by type.
 */
function buildPosts(collectionApi) {
    const maxLatestPosts = 4;
    const blogPosts = collectionApi.getFilteredByTag('post')
        .reverse()
        .reduce(
            (posts, post) => {
                const locale = determineLocale(post.data.page);
                const locPosts = posts[locale] || {}
                posts[locale] = locPosts;
                const latest = locPosts.latest || []
                locPosts.latest = latest;
                if (latest.length < maxLatestPosts) {
                    latest.push(post);
                } else {
                    const type = determinePostType(post);
                    const typeList = locPosts[type] || []
                    locPosts[type] = typeList;
                    typeList.push(post);
                }
                return posts;
            },
            {});
    return blogPosts;
}

module.exports = { buildPosts };
