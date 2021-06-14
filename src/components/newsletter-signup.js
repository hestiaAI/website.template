import { LitElement, html, css } from 'lit-element';
import { registerTranslateConfig, use, translate } from "lit-translate";

const LAYOUT_NORMAL = "normal",
      LAYOUT_COMPACT = "compact",
      LAYOUT_DEFAULT = LAYOUT_NORMAL,
      LAYOUT_ENUM = [LAYOUT_NORMAL, LAYOUT_COMPACT];

const DEFAULT_TRANSLATIONS = {
  "title": "Sign up to our newsletter",
  "info": "We won't really spam you",
  "first_name": "First name",
  "last_name": "Last name",
  "email": "Email address",
  "submit_button": "Send"
};

registerTranslateConfig({
  loader: async (lang) => {
    try {
      const result = await fetch(`/assets/i18n/newsletter-signup.json`);
      const translations = await result.json();
      return translations[lang] || DEFAULT_TRANSLATIONS;
    } catch(error) {
      return  DEFAULT_TRANSLATIONS;
    }
  }});

/**
 * ‹newsletter-signup› custom element, displaying a
 * form to sign up for a newsletter.
 *
 * Submitted values will be sent to and stored into the
 * Netlify Forms service.
 *
 * Note:
 *
 *   Netlify buildbots find the forms by parsing the
 *   static HTML of the site when the build completes; as
 *   this Web Component renders the form client-side, the
 *   buildbots won't find the form.
 *   To work around this, a hidden form needs to be added
 *   to the static HTML, somewhere outside of this Web Component,
 *   with the same form structure as the one rendered hereafter.
 *
 * See also:
 *   Netlify Docs › Forms setup › JavaScript forms
 *   https://docs.netlify.com/forms/setup/#work-with-javascript-rendered-forms
 *
 * Attributes:
 *
 *   lang: String
 *     Language of the page on which the component
 *     is displayed; will be placed in a hidden field,
 *     to be stored with the other fields of the form.
 *
 *   form-name: String
 *     Name of the Netlify Form.
 *
 *   layout (optional): "normal" (default) | "compact"
 *     Determines how to display the form to the user:
 *     `normal` displays title, info, fields and their labels;
 *     `compact` display title and fields only, with
 *     placeholders inside fields instead of labels.
 *
 * Usage:
 *
 *     <form name="newsletter-signup" method="POST" data-netlify="true">
 *         <input type="hidden" name="first-name">
 *         <input type="hidden" name="last-name">
 *         <input type="hidden" name="email">
 *         <input type="hidden" name="lang" />
 *     </form>
 *
 *     <newsletter-signup
 *         lang="en" layout="compact"
 *         form-name="newsletter-signup">
 *     </newsletter-signup>
 *
 */
export class NewsletterSignup extends LitElement {

  static get styles() {
    return css`
        @import '/assets/styles/vendor/normalize.css';
        @import '/assets/styles/base/typography.css';
        @import '/assets/styles/base/spacing.css';
        @import '/assets/styles/elements/buttons.css';
        @import '/assets/styles/elements/forms.css';

        :host {
          display: block; }

        h3, p { margin: 0; }

        p { margin-bottom: 0.5rem; }

        button { margin-top: 0.5rem; }

        .signup-fields {
          display: flex; }

        .signup-field {
          flex: 1;
          min-width: 48%;
          padding-left: 1rem;
          padding-bottom: 0.5rem; }

        .signup-field:first-child {
          padding-left: 0; }

        .signup-field input {
          display: inline-block;
          width: 100%; }
    `;
  }

  static isValidLayout( value) {
    return typeof value === "string"
      && LAYOUT_ENUM.includes( value);
  }

  static get properties() {
    return {
      lang: { type: String },
      netlifyFormName: { type: String, attribute: "form-name" },
      layout: {
        type: String,
        converter: {
          fromAttribute: function normalizeLayoutProp( value, type) {
            return NewsletterSignup.isValidLayout( value)
              ? String( value) : LAYOUT_DEFAULT;
          }
        }
      }
    }
  }

  constructor() {
    super();
  }

  firstUpdated() {
    // Load the default language
    use(this.lang);
  }

  render() {
    return html`
      <h3>${translate("title")}</h3>
      ${this.layout === LAYOUT_COMPACT || !translate("info")
        ? '' : html`<p>${translate("info")}</p>` }
      <form class="signup" method="POST" data-netlify="true">
        <input type="hidden" name="form-name" value="${this.netlifyFormName}" />
        <input type="hidden" name="lang" value="${this.lang}" />
        <div class="signup-fields">
          <div class="signup-field">
            ${this.layout === LAYOUT_COMPACT ? '' : html`
              <label for="signup-first-name">
                ${translate("first_name")}
              </label>`}
            <input type="text" name="first-name"
                   id="signup-first-name"
                   placeholder="${translate("first_name")}">
          </div>
          <div class="signup-field">
            ${this.layout === LAYOUT_COMPACT ? '' : html`
              <label for="signup-last-name">
                ${translate("last_name")}
              </label>`}
            <input type="text" name="last-name"
                   id="signup-last-name"
                   placeholder="${translate("last_name")}">
          </div>
        </div>
        <div class="signup-fields">
          <div class="signup-field">
            ${this.layout === LAYOUT_COMPACT ? '' : html`
              <label for="signup-email">
                  ${translate("email")}
              </label>`}
            <input type="email" name="email"
                   id="signup-email"
                   placeholder="${translate("email")}">
          </div>
        </div>
        <div>
          <button type="submit">${translate("submit_button")}</button>
        </div>
      </form>
    `;
  }
}

customElements.define('newsletter-signup', NewsletterSignup);