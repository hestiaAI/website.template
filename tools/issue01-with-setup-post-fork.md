### Preparation

You'll probably already defined values for the following main placeholders, before forking the template repository:

- [x] Figure out a title for the new website ⟶ `‹SITE-TITLE›`; _for instance, `Dating Privacy`_  `TODO`
- [x] Figure out a name for the new website ⟶ `‹SITE-NAME›`; _for instance, `dating-privacy`_ `TODO`
- [x] Figure out a two letters short name for the new website ⟶ `‹SITE-SHORTNAME›`; _for instance, `dp`_ `TODO`
- [x] Figure out a name for the new repository ⟶ `‹REPO-NAME›`; _for instance, `website.dp`_ `TODO`

Optional at this stage, but have to be defined before site public launch:

- [ ] Decide an URL for the new website ⟶ `‹SITE-URL›` _to be reserved in Gandi and used in Netlify; for instance, `your-showcase.hestialabs.org`_
- [ ] Get the Netlify Site UUID ⟶ `‹SITE-UUID›` _used in `README.md`_
- [ ] Decide who'll be the owner of the community ⟶ `‹SITE-OWNER-NAME›` _used in `package.json`: `Charles Foucault-Dumas`_
- [ ] Decide a Twitter account name linked to the new website ⟶ `‹TWITTER-ACCOUNT-NAME›`
- [ ] Decide an URL for the forum linked to the new website ⟶ `‹FORUM-SITE-URL›`

### Actions

#### Following the [above mentioned instructions](https://github.com/hestiaAI/website.docs/tree/main/website-new), you probably already…

— however please fill in the date and your initials after the `DONE` statuses —

- [x] Forked the [WEBSITE.TEMPLATE](https://github.com/hestiaAI/website.template) repository to [this one](../) `DONE`  
- [x] Edited the [`README.md`](../#readme), updated the first **`‹SITE-TITLE›`** placeholder, with the title of the new website, and removed the blockquoted comments preceding the title `DONE` 
- [x] Updated the description in the repository details (`HestiaLabs ‹SITE-TITLE› website` usually) `DONE`
- [x] Updated the tags in the repository details (please set `community` and `websites` at minimum) `DONE`
- [x] Updated the Website URL in the repository details (`‹SITE-URL›.hestialabs.org` usually) `DONE`

#### Initial setup, within the new forked repository

- [ ] Optionally, update the list of contributors in [`package.json`](../blob/main/package.json)
- [ ] Run `npm install` on the command-line `TODO` 
- [ ] Commit your changes to `package.json` and the updated `package-lock.json` `TODO` 
- [ ] Run `npm run setup-post-fork` on the command-line, set the four main placeholders `TODO` 
- [ ] Optionally run `npm run setup-post-fork` on the command-line, set the remaining placeholders and theme colors `TODO` 

#### Basic configuration

- [ ] Review the redirect rules in [`netlify.toml`](../blob/main/netlify.toml), update them according to your needs and commit your changes `TODO` 
- [ ] Review search engine disallow rules in [`robots.txt`](../blob/main/src/site/robots.txt) and update them if needed `TODO` 
- [ ] Review the contents of the _splash landing_ page in [`src/site/index.html`](../blob/main/src/site/index.html) `TODO` 
- [ ] Review the contents of the _Web App Manifest_ in [`src/site/manifest.json`](../blob/main/src/site/index.html) `TODO` 
- [ ] Commit your changes `TODO` 

#### Netlify Hosting setup

- [ ] follow [doc about setting up a netlify website](https://github.com/hestiaAI/website.docs/blob/main/website-new/SETUP-NETLIFY.md) `TODO`
- [ ] Take the value of `‹SITE-UUID›` on tab *Site settings*, API ID `TODO`

#### After finishing the Netlify site setup, within the new forked repository

- [ ] Run `npm run setup-post-fork` on the command-line, set the values for **`‹SITE-UUID›`**, **`‹SITE-NAME›`** and **`‹SITE-URL›`**  `TODO` 
- [ ] Commit your changes `TODO` 
- [ ] [Setup Netlify Large Media](https://github.com/hestiaAI/website.docs/blob/main/website-new/SETUP-NETLIFY-LARGE-MEDIA.md#setup-netlify-large-media) for the new repository `TODO`
- [ ] Edit, remove comments, save and commit the updated [`.lfsconfig`](../blob/main/.lfsconfig) file, that the above Netlify LM setup created `TODO`

#### Theme configuration

`TODO` update logo

#### Cleanup

- [ ] Run `npm run setup-post-fork` on the command-line, set all known remaining placeholders and colors`TODO` 
- [ ] Commit your changes `TODO` 

### Hand-over to site owner

#### Configure canonical URL and social network links

- [ ] Update the **`‹FORUM-SITE-URL›`** placeholder in [`src/site/_data/links.json`](../blob/main/src/site/_data/links.json) and [`src/site/community/{en,fr}/index.md`](../blob/main/src/site/community/en/index.md) `TODO`
- [ ] Update the **`‹TWITTER-ACCOUNT-NAME›`** placeholder in [`src/site/_data/links.json`](../blob/main/src/site/_data/links.json) and [`src/site/community/{en,fr}/index.md`](../blob/main/src/site/community/en/index.md) `TODO`

`TODO` configure blog (authors, categories)
`TODO` edit blog contents (editorials, infographics, interviews)
