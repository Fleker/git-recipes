import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/iron-icons.js';

class CarouselImage extends PolymerElement {
  static get template() {
    return html`
      <style>
        img {
          width: 90%;
          max-width: calc(40em - 96px);
          border-radius: 8px;
        }

        div {
          background-color: rgba(0,0,0,0.5);
          color: white;
          margin-top: -40px;
          position: absolute;
          padding-left: 8px;
          padding-top: 2px;
          padding-bottom: 2px;
          padding-right: 40px;
          border-top-right-radius: 16px;
          border-bottom-right-radius: 16px;
        }
      </style>
      <img src="[[src]]" alt="[[description]]" />
      <div>
        [[description]]
      </div>
    `;
  }
  static get properties () {
    return {
      'src': {
        type: String,
        reflectToAttribute: true,
      },
      'description': {
        type: String,
        reflectToAttribute: true,
      }
    };
  }
}

customElements.define('carousel-image', CarouselImage);