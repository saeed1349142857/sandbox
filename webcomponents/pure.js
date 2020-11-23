class BlueBuy extends HTMLElement {
    constructor() {
      super();

    }

    connectedCallback() {
      this.innerHTML = `<button type="button">buy for 66,00 €</button>`;
    }
  }
  window.customElements.define('blue-buy', BlueBuy);