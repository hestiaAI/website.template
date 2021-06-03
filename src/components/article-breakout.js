import { LitElement, html, css } from 'lit-element';

const LAYOUT_BOX = "box",
      LAYOUT_CARD = "card",
      LAYOUT_CARD_ALT = "card-alt",
      LAYOUT_DEFAULT = LAYOUT_BOX,
      LAYOUT_ENUM = [LAYOUT_BOX, LAYOUT_CARD, LAYOUT_CARD_ALT];

/**
 * ‹article-breakout› custom element, displaying an image,
 * heading and short lead in a shadowed box or card layout.
 *
 * Attributes:
 *
 *   layout (optional): "box" (default) | "card" | "card-alt"
 *     Determines how to display contents to the user;
 *     `box` stacks image on top of heading and body;
 *     `card` places image to the left of heading and
 *     body, which are stacked on top of each other;
 *     `card-alt` is like `card`, but places the image
 *     to the right of heading and body.
 *
 *   href (mandatory): String
 *     URL of full article, to redirect to when the
 *     article breakout is clicked anywhere.
 *
 *   img-src (mandatory): String
 *     URL of the image illustrating the article.
 *
 * Slots:
 *
 *   caption (optional): String|Inline
 *
 *      Image caption, which should contain raw text
 *      or inline-elments only (<a> for instance); not
 *      displayed to user, only visible in source code.
 *
 *      Recommended structure:
 *
 *          <span slot="caption">…</span>
 *
 *   ‹default› (mandatory): Inline|Block
 *
 *      Body of the article breakout, which can include a mix
 *      of inline and block elements (<p>, <ul>/<li>, <button>).
 *
 *      Recommended structure:
 *
 *          <h1>Article title</h1>
 *          <p>Article lead</p>
 *          <button>Read more</button>
 *
 * Sample usage:
 *
 *     <article-breakout layout="box"
 *                       href="/en/blog/article-1234/"
 *                       img-src="illustration.jpg">
 *       <span slot="caption">Photo by …</span>
 *       <h2>Article title</h2>
 *       <p>An <em>attention</em>-<strong>grabbing</strong> lead.</p>
 *       <button>Read more</button>
 *     </article-breakout>
 *
 * Note:
 *
 *   We left the choice of structural elements as much as
 *   possible of choice to page authors / users of this
 *   custom element, so to allow host styles to apply.
 *
 *   If we had inlined the <h1>, <p> and <button> in the
 *   template of this component, we would have needed to
 *   replicate the host CSS rules, to inherit the styling.
*/
export class ArticleBreakout extends LitElement {

  static get styles() {
    return css`
      :root {
        --breakout-text-color:  #333333;
        --breakout-bg-color:    #f6f8fa;
        --line-height-half:     0.5rem;
        --breakout-shadow:      0 3px 6px rgba(27,31,35,0.8);
        --breakout-img-shadow:  1px 2px 4px rgba(27,31,35,0.8);
        --breakout-padding:     1rem;
      }

      :host {
        display: inline-block; }

      a.no-appearance {
        text-decoration: none;
      }

      .box, .card {
        color: var(--color-text-tertiary);
        background-color: var(--color-bg-tertiary);
        box-shadow: var(--breakout-shadow);
        min-height: 8rem;
        padding: var(--breakout-padding);
      }

      .box {
        max-width: 30rem; }

      figure {
        max-width: 100%;
        width: 100%;
        margin: 0 0; }

      .column-layout {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center; }

      .column-one-half {
        flex: 1;
        min-width: 48%;
        max-width: 48%; }

      img {
        box-shadow: var(--breakout-img-shadow);
        object-fit: cover;
        width: 100%; }

      figure > figcaption {
        display: none; }

      .card h1 {
        margin-top: 0; }

      .box h1 {
        margin-top: var(--line-height-half); }

      .place-first {
        order: -1; }

      /* @media (max-width: env(--breakpoint-width-md)) */
      @media (max-width: 768px) {
        .column-layout,
        .column-one-half {
          display: block; }

        .column-one-half {
          min-width: 96%; }

        .place-first {
          order: 0; } /* on mobile devices, do not alternate left/right placement of image/text */
      }               /* (by invalidating order modification / restoring default order) */
    `;
  }

  static isValidLayout( value) {
    return typeof value === "string"
      && LAYOUT_ENUM.includes( value);
  }

  static get properties() {
    return {
      href: { type: String },
      imgSrc: { type: String, attribute: "img-src" },
      layout: {
        type: String,
        converter: {
          fromAttribute: function normalizeLayoutProp( value, type) {
            return ArticleBreakout.isValidLayout( value)
              ? String( value) : LAYOUT_DEFAULT;
          }
        }
      }
    }
  }

  constructor() {
    super();
    this.layout = LAYOUT_DEFAULT;
  }

  renderAsCard( withAlternateLayout) {
    const placeFirstOrderModifier = !!withAlternateLayout ? ' place-first' : '';
    return html`
      <article class="card column-layout">
        <figure class="column-one-half">
          <img src="${this.imgSrc}">
          <figcaption><slot name="caption"></slot></figcaption>
        </figure>
        <div class="column-one-half${placeFirstOrderModifier}">
          <slot>
            <h1>‹Title›</h1>
            <p>‹Article lead›</p>
            <button>Read more</button>
          </slot>
        </div>
      </article>`;
  }

  renderAsBox() {
    return html`
      <article class="box">
        <figure>
          <img src="${this.imgSrc}">
          <figcaption><slot name="caption"></slot></figcaption>
        </figure>
        <div>
          <slot>
            <h1>‹Title›</h1>
            <p>‹Article lead›</p>
            <button>Read more</button>
          </slot>
        </div>
      </article>`;
  }

  render() {
    const articleHTMLFrag = (this.layout === LAYOUT_BOX)
      ? this.renderAsBox()
      : this.renderAsCard( this.layout === LAYOUT_CARD_ALT);
    return (typeof this.href !== "undefined" && this.href !== null)
      ? html`<a class="no-appearance" href="${this.href}">${articleHTMLFrag}</a>`
      : articleHTMLFrag;
  }
}

customElements.define('article-breakout', ArticleBreakout);