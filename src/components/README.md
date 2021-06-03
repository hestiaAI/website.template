# Web Components

Web Components of our website.

## Available components

* `<article-breakout href="…"> …text… </article-breakout>`
* `<contact-card img-src="portrait.jpg"> …text… </contact-card>`
* `<contact-form form-name="contact" lang="en" subject="…text…"></contact-form>`
* `<newsletter-signup form-name="newsletter-signup" lang="en"></newsletter-signup>`
* `<video-player src="…" img-src="…"> …text… </video-player>`

## Usage

Sample usage of the ‹article-breakout› component; applies to all our components:

```javascript
<article-breakout layout="box"
  href="en/blog/editorial/first-post/"
  img-src="illustration.jpg">
  <span slot="caption">photo by …</span>
  <h2>A first blog post</h2>
  <p>An <em>attention</em>-<strong>grabbing</strong> lead.</p>
  <button>Read more</button>
</article-breakout>

<script type="module">
  import '/components/article-breakout.js';
</script>
```

## Disambiguation

By ‹Web Components›, in this project, we mean the standardized _front-end_ [Web Components](https://www.webcomponents.org/introduction), which incarnate as custom elements in web pages, registered and instanciated at _runtime_ by the browser. For instance:

```html
<sar-helper domain="dating-apps">
Reclaim your <em>Dating App</em> data!
</sar-helper>
```

As we are also using [Eleventy](https://www.11ty.dev), to statically generate our websites, the following might confuse you:

* reusable fragments of content, such as _includes_ and _layouts_, might be understood as «web components», conceptually;
* [Eleventy template shortcodes](https://www.11ty.dev/docs/shortcodes/), that is, parametrized _macros_ which generate code, are conceptually similar to «web components» too;
* however both run at _build time_, inlining those fragments of reusable HTML5/CSS code.

This issue gets coarser, when you consider that:

1. Without a static site generator, you tend to develop a lot of ‹Web Components›; with a static site generator, some ‹Web Component› can be replaced with inlined HTML5/CSS code (you loose CSS encapsulation along the way, but other tools allow to solve the namespacing issues), so you tend to not use ‹Web Components› until late in the implementation; drawing the line between what goes in the «macros» of Eleventy and ‹Web Components› is more difficult, when using static site generators.
2. Other static generators (such as [stencil.js](https://stenciljs.com)) allow produce ‹Web Components›, instead of inlining HTML5/CSS code; and for good reason, as they are aimed at producing _Design Systems_.

We are aimed at producing a _Design System_ too; at therefore inclined to introduce ‹Web Components› rather early than late in the implementation. 

Yet we are at the very beginning of our journey, so determining how to implement _reusable functionality_ might require further conversation — don't hesitate to reach out to [@olange](http://github.com/olange) with your questions.