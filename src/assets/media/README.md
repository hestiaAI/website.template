## `src/assets/media` ⟶ `assets/media/`

This folder contains **media** assets, that were uploaded
here by end-users thru the CMS; although stored with LFS,
omitting those file in a checkout would break the site preview.

The files placed here are directly stored in [Netlify's Large
Media](https://docs.netlify.com/large-media/overview/) infrastructure
via [Git LFS](https://git-lfs.github.com), and served at URL
`/assets/media/**`.

## Motivations

1. the large media assets are more efficiently delivered to
   end-users by Netlify's Edge servers and CDN , thru their
   dedicated «large media» infrastructure;
2. those assets don't need to be transferred from GitHub to
   Netlify, on every push/build of the site — saving precious
   build minutes, that we would have to pay for.

## Setup

To be able to pull the large binary assets of this folder,
or to  add new ones, you need to setup [Git LFS](https://git-lfs.github.com) on your computer; see for instance:

[GitHub › Docs › Installing Git Large File Storage](https://docs.github.com/en/github/managing-large-files/installing-git-large-file-storage)

## Note

The GitHub repository does not contain the binary
contents of the files of this folder. Instead, our repository
only contains a <1KB file, which holds a reference to the
actual binary contents, stored «elsewhere» by the LFS _provider_
that we did setup within this repository — that is, ‹Netlify
Large Media› infrastructure.

## Warning — before deleting a site in Netlify

The above note also importantly means: if the «elsewhere» was
**deleted** — that is, if we would delete the ‹Dating Privacy›
site in Netlify's console —, the binary contents of this folder
would be **gone/lost forever**, without any way of recovering
them from Netlify, our remote LFS provider.

So before deleting the site at Netlify, ensure we hold a copy
somewhere. In case of doubt, create a complete mirror of the
repository. This guide provides guidance and more information:

[Netlify › Docs › Large Media › Requirements and limitations› Delete a site with Large Media enabled](https://docs.netlify.com/large-media/requirements-and-limitations/#delete-a-site-with-large-media-enabled)

## See also

* [WEBSITE.TEMPLATE.factory #27](https://github.com/hestiaAI/website.template.factory/issues/27) Activate Git+Netlify LFS for large media assets