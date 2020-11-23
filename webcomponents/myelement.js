import { LitElement, html, css } from 'lit-element';

class MyElement extends LitElement {
  static get properties() {
    return { mood: { type: String } };
  }

  static get styles() {
    return css`

    span {
      color: blue;
    }

    :host {
      color: red;
    }`;
  }

  constructor() {
    super();
    this.mood='Hello world! From my-element';
  }

  handleClick(e) {
    console.log('YOU BET I HANDLED IT 456', e);
    let myEvent = new CustomEvent('my-event', {
      detail: { message: 'my-event happened.', character: 'yoda'  },
      bubbles: true,
      composed: true});
    this.dispatchEvent(myEvent);
  }

  render() {
    console.log(this);
    return html`Web Components are <span>${this.mood}</span>! <button @click="${this.handleClick}">`;
  }
}

customElements.define('my-app', MyElement);