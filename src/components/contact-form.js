import { LitElement, html, css } from 'lit-element';
import { registerTranslateConfig, use, translate } from "lit-translate";

const TRANSLATION_FIELDS = {
    first_name: "contact-form-first_name",
    last_name: "contact-form-last_name",
    email: "contact-form-email",
    subject: "contact-form-subject",
    message: "contact-form-message",
    submit_button: "contact-form-submit_button"
};

const t = TRANSLATION_FIELDS;

const DEFAULT_TRANSLATIONS = {
    [t.subject]: "Subject",
    [t.first_name]: "First name",
    [t.last_name]: "Last name",
    [t.email]: "Email address",
    [t.message]: "Type your message here",
    [t.submit_button]: "Send"
};

registerTranslateConfig({
  loader: async (lang) => {
    try {
      const result = await fetch(`/assets/i18n/component-translations.json`);
      const translations = await result.json();
      return translations[lang] || DEFAULT_TRANSLATIONS;
    } catch(error) {
      return  DEFAULT_TRANSLATIONS;
    }
  }
});

/**
 * ‹contact-form› custom element, displaying a form
 * to write and send a message to the site owners.
 *
 * Submitted values will be sent to and stored into
 * the Netlify Forms service.
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
 *   subject: String (optional)
 *     Content of the subject field
 *
 * Usage:
 *
 *     <form name="contact" method="POST" data-netlify="true">
 *       <input type="hidden" name="first-name">
 *       <input type="hidden" name="last-name">
 *       <input type="hidden" name="email">
 *       <input type="hidden" name="subject">
 *       <input type="hidden" name="message">
 *       <input type="hidden" name="lang" />
 *     </form>
 *
 *     <contact-form
 *       lang="en"
 *       form-name="contact"
 *       subject="My credit card has been blocked">
 *     </contact-form>
 *
 */
export class ContactForm extends LitElement {

  static get styles() {
    return css`
      @import '/assets/styles/vendor/normalize.css';
      @import '/assets/styles/base/typography.css';
      @import '/assets/styles/base/spacing.css';
      @import '/assets/styles/elements/buttons.css';
      @import '/assets/styles/elements/forms.css';

      :host {
        display: block; }

      .fields {
        display: flex; }

      .field {
        flex: 1;
        min-width: 48%;
        padding-left: 0.75rem;
        padding-bottom: 0.75rem;
      }

      .field:first-child {
        padding-left: 0; }

      .field input, .field textarea{
        display: block;
        width: 100%; }

      .field textarea {
        height: 10rem; }
    `;
  }

  static get properties() {
    return {
      lang: { type: String },
      netlifyFormName: { type: String, attribute: "form-name" },
      subjectContent: { type: String, attribute: "subject" }
    }
  }

  constructor() {
    super();
    this.subjectContent = "";
  }

  firstUpdated() {
    // Load the default language
    use(this.lang);
  }

  render() {
    return html`
      <form class="signup" method="POST">
        <input type="hidden" name="form-name" value="${this.netlifyFormName}" />
        <input type="hidden" name="lang" value="${this.lang}" />
        <div class="fields">
          <div class="field">
            <label for="first-name"> ${translate(t.first_name)} </label>
            <input type="text" name="first-name" id="first-name"
                   placeholder="${translate(t.first_name)}">
          </div>
          <div class="field">
            <label for="last-name"> ${translate(t.last_name)} </label>
            <input type="text" name="last-name" id="last-name"
                   placeholder="${translate(t.last_name)}">
          </div>
        </div>
        <div class="fields">
          <div class="field">
            <label for="email"> ${translate(t.email)} </label>
            <input type="email" name="email" id="email"
                   placeholder="${translate(t.email)}">
          </div>
        </div>
        <div class="fields">
          <div class="field">
            <label for="subject"> ${translate(t.subject)} </label>
            <input type="text" name="subject" id="subject"
                   value="${this.subjectContent}"
                   placeholder="${translate(t.subject)}">
          </div>
        </div>
        <div class="fields">
          <div class="field">
            <label for="message"> ${translate(t.message)} </label>
            <textarea placeholder="${translate(t.message)}"
                      name="message" id="message" ></textarea>
          </div>
        </div>
        <button type="submit">${translate(t.submit_button)}</button>
      </form>
    `;
  }
}

customElements.define('contact-form', ContactForm);
