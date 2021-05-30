/* eslint-env node */

const contactUrl = (lang, channelId) =>
 `/${lang}/contact/${channelId}`;

module.exports = { contactUrl };
