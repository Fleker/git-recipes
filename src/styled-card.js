import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class StyledCard extends PolymerElement {
  static get template() {
    return html`
      <style>
        div {
            background-color: #f9f9f9;
            border: solid 1px #999;
            border-radius: 12px;
            max-width: 40em;
            margin-left: auto;
            margin-right: auto;
            padding-left: 16px;
            padding-right: 16px;
            margin-top: 24px;
            padding-bottom: 36px;
            transition: all 0.5s;
        }

        div h1 {
            margin-bottom: 0px;
        }

        div h2 {
            font-size: 14pt;
        }
      </style>
      <div>
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('styled-card', StyledCard);