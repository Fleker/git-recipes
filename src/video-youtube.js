import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/iron-icons.js';

class PlayerYouTube extends PolymerElement {
  static get template() {
    return html`
    <style>
      iframe {
        transition: all 0.5s;
        width: 560px;
        height: 315px;
      }

      @media (max-width: 600px) {
        iframe {
          width: 90vw;
        }
      }
    </style>
    <iframe 
        width="560"
        height="315"
        id="iframe"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        style="display: block"
        allowfullscreen>
      </iframe>
    `;
  }
  static get properties () {
    return {
      'vid': {
        type: String,
        reflectToAttribute: true,
      }
    };
  }

  connectedCallback() {
      super.connectedCallback();
      this.$.iframe.src = `https://www.youtube-nocookie.com/embed/${this.vid}`;
  }
}

customElements.define('player-youtube', PlayerYouTube);