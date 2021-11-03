> Template repository, with code and issues common to every new ‹data community› website, meant to be forked to create new websites.
>
> 🎯 To create a new website based on this template repository, follow the step-by-step guide [«How-to create a new website from WEBSITE.TEMPLATE»](https://github.com/hestiaAI/website.docs/tree/main/website-new) in the [`WEBSITE.DOCS`](https://github.com/hestiaAI/website.docs/) repository.
>
> 💡 To report issues about this template repository itself, please head to the [WEBSITE.TEMPLATE.factory](https://github.com/hestiaAI/website.template.factory) repository.

---

# ‹SITE-TITLE› website

[![Netlify Status](https://api.netlify.com/api/v1/badges/‹SITE-UUID›/deploy-status)](https://app.netlify.com/sites/‹SITE-NAME›/deploys) ⟵ `TODO`: update ‹SITE-UUID› and ‹SITE-NAME›

# Access

* [`‹SITE-URL›/{fr,en}/`](https://‹SITE-URL›/en/) ⟵ since public launch;
* [`‹SITE-NAME›.netlify.app/{fr,en}/`](https://‹SITE-NAME›.netlify.app/en/) ⟵ for development, prior to public launch.

# Features

- Multilingual site (fr/en)
- Content authoring system with [NetlifyCMS](https://netlifycms.org)
- Static publication system with [Eleventy](https://11ty.dev)
- Authentication/authorization with [Netlify Identity](https://app.netlify.com/sites/hestialabs/identity)
- Hosting and CDN with [Netlify Hosting](https://app.netlify.com/sites/hestialabs/overview)
- [Static homepage](https://‹SITE-URL›/en/) & site specific pages
- [Blog system](https://‹SITE-URL›/en/blog/)
- [Contact form](https://‹SITE-URL›/en/about/#contact), with Netlify Forms
- [Newsletter sign-up form](https://‹SITE-URL›/en/#newsletter), with Netlify Forms

# How-to?

* [Get access rights](https://github.com/hestiaAI/website.docs/tree/main/website-access-rights) — _would you need _editorial access_ to the website contents; or to _administer_ our Netlify deployment & hosting infrastructure_
* [Setup your dev environment](https://github.com/hestiaAI/website.docs/tree/main/website-dev-setup) — _develop features of the website, install prequisite tools and dependencies and start the dev server_
* [Execute the dev, build and deployment sequences](https://github.com/hestiaAI/website.docs/tree/main/website-execution) — _understand the execution modes, environments and how-to execute the dev, build and deployment sequences_
* [Contribute to codebase](https://github.com/hestiaAI/website.docs/tree/main/website-contrib) — _design decisions you should know about and how-to submit code changes_

# Repository contents

## Deliverables

The website is made of two major deliverables, whose sources are available in this repository:

1. [WEBSITE](https://‹SITE-NAME›.netlify.app): publicly accessible website of HestiaLabs, in french and english;
2. [CMS](https://‹SITE-NAME›.netlify.app/admin/): our content-authoring system (_aka_ [Netlify CMS](https://www.netlifycms.org)) web app, accessible thru invite only.

## Repository structure

```ascii
/ ....................... NPM, 11ty & Netlify scripts for assembly, publishing & deployment
|
+-- conf/ ............... Config of our publish & deploy pipeline
|   +-- 11ty/ ........... Eleventy config files included from .eleventy.js
|   +-- netlify/ ........ Netlify config files
|       +-- cms/ ........ NetlifyCMS webapp runtime config file, deployed to admin/ upon build
|       +-- forms/ ...... Netlify Forms static definitions, deployed to admin/form/ upon build
|
+-- src/ ................ Sources (en/fr) of the components used to generate the website
|   +-- components/ ..... Web Components (front-end) used in layouts
|   +-- assets/ ......... Media assets, such as stylesheets and images used by theme or uploaded by users
|       +-- fonts/ ...... Fonts of the theme
|       +-- img/ ........ Images of the theme, directly added with Git
|       +-- large-media/. Large media assets, directly added with Git, stored in Netlify Large Media Storage — which could be omitted from a checkout to save space, without breaking the preview too much
|       +-- media/ ...... Media assets, uploaded by end-users with the CMS, stored in Netlify Large Media Storage
|       +-- styles/ ..... Stylesheets of the theme
|   +-- admin/ .......... NetlifyCMS single-page web app, to edit contents online
|   +-- site/ ........... Actual contents of website, along with layouts and assets
|       +-- _data/ ...... Fragments of data consumed by 11ty to generate static pages
|       +-- _includes/ .. Includes consumed by 11ty to generate static pages
|       +-- _layout/ .... Layouts consumed by 11ty to generate static pages
|       +-- home/ ....... Main homepage
|       +-- about/ ...... About us page
|       +-- blog/ ....... Blog homepage, posts, authors and categories
|       +-- contact/ .... Contact form
|       +-- legal/ ...... Legal notice page
|       +-- media/ ...... Press and media page
|       +-- …/ .......... …
|
+-- build/ .............. (transient) Generated website, in its various stages
|   +-- 11ty/ ........... (transient) Generated by 11ty, picked up by Snowpack
|   +-- snowpack/ ....... (transient) Generated by Snowpack and deployed by Netlify
|
+-- tools/ .............. Utility command-line scripts for development & administrative tasks
```

## Essential configuration files

```ascii
/ 
|
+-- netlify.toml ......... Netlify CB/CD and hosting config, which includes definition of
|                          runtime URL redirects, role-based access restrictions and HTTP-header overrides
+-- .eleventy.js ......... In-/out folders and config of 11ty build process
+-- .snowpack.config.js .. In-/out folders and config of Snowpack dev & build processes
+-- .gitattributes ....... Folders and files with Git LFS (Large File Storage) enabled
|
+-- conf/netlify/
    +-- cms/config.yml ... NetlifyCMS webapp runtime config
    +-- forms/*.html ..... Netlify Forms static definitions
```

## URL space

Source folders contents are mounted at following public URLs, in the published website; the folders not represented hereafter are not published and mounted at URLs (source: [`.eleventy.js`](.eleventy.js)):

```ascii
/
|
+-- conf/
|   +-- netlify/
|       +-- cms/config.yml ⟶ /admin/config.yml
|       +-- forms/*.html ——⟶ /admin/forms/
|
+-- src/
    +-- components/ ———⟶ /components/
    +-- assets/ ———————⟶ /assets/
    +-- admin/ ————————⟶ /admin/
    +-- site/
        +-- _data/i18n ⟶ /assets/i18n/
        +-- home/ —————⟶ /
        +-- about/ ————⟶ /about/
        +-- blog/ —————⟶ /blog/
        +-- contact/ ——⟶ /contact/
        +-- legal/ ————⟶ /legal/
        +-- media/ ————⟶ /media/
        +-- …/ ————————⟶ /…/
```