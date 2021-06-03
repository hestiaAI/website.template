import { LitElement, html, css } from 'lit-element';

/**
 * ‹contact-card› custom element, displaying an image of,
 * a person, a heading and short bio in a shadowed card.
 *
 * Attributes:
 *
 *   img-src (mandatory): String
 *     URL of the portrait of the person.
 *
 * Slots:
 *
 *   ‹default› (mandatory): Inline|Block
 *
 *      Body of the contact card, which can include a mix
 *      of inline and block elements (<p>, <ul>/<li>, <button>).
 *
 *      Recommended structure:
 *
 *          <h1>Name</h1>
 *          <p>Bio</p>
 *          <a href="https://twitter.com/‹userId›">twitter</a>
 *
 * Sample usage:
 *
 *     <contact-card img-src="portrait.jpg">
 *       <h1>Paul-Olivier</h1>
 *       <p>Paul is a mathematician by training […]</p>
 *       <a href="https://twitter.com/podehaye">Twitter</a>
 *     </contact-card>
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
export class ContactCard extends LitElement {

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

      article {
        color: var(--breakout-text-color);
        background-color: var(--breakout-bg-color);
        box-shadow: var(--breakout-shadow);
        min-height: 8rem;
        padding: var(--breakout-padding);
      }

      figure {
        width: 100%;
        margin: 0 0; }

      .column-layout {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center; }

      .column-one-third {
        flex: 1;
        min-width: 32%;
        max-width: 32%; }

      .column-two-thirds {
        flex: 1;
        min-width: 64%;
        max-width: 64%; }

      img {
        box-shadow: var(--breakout-img-shadow);
        clip-path: circle(7rem at center);
        width: 100%; }

      figure > figcaption {
        display: none; }

      article h1 {
        margin-top: 0; }

      /* @media (max-width: env(--breakpoint-width-md)) */
      @media (max-width: 768px) {
        .column-layout {
          display: block; }

        .column-one-third,
        .column-two-thirds {
          min-width: 96%; }
      }
    `;
  }

  static get properties() {
    return {
      name: { type: String },
      imgSrc: { type: String, attribute: "img-src" }
    }
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <article class="column-layout">
        <figure class="column-one-third">
          <img src="${this.imgSrc}" aria-label="${this.name}">
          <figcaption>${this.name}</figcaption>
        </figure>
        <div class="column-two-thirds">
          <slot>
            <h1>‹Title›</h1>
            <p>‹Article lead›</p>
            <button>Read more</button>
          </slot>
        </div>
      </article>
    `;
  }
}

customElements.define('contact-card', ContactCard);