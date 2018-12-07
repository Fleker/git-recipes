import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './styled-card.js';
import './titlebar.js';

class Cookbook extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
        }

        .direction {
          margin-bottom: 24px;
        }

        @media (max-width: 600px) {
          #card {
            width: 100%;
            margin-left: -8px;
          }
        }

        </style>
      <title-bar id='titlebar' stars='[[stars]]' recipe-id='[[recipeId]]'></title-bar>
      <styled-card>
        <template is="dom-repeat" items="{{collections}}">
          <h2>[[item.key]]</h2>
          <ul>
          <template is="dom-repeat" items="{{item.value}}">
            <li><a href="/[[recipeId]]/[[item.key]]">[[item.label]]</a></li>
          </template>
          </ul>
        </template>
      </styled-card>
    `;
  }
  static get properties () {
    return {
      'stars': {
        type: Number,
        reflectToAttribute: true,
      },
      'collections': {
        type: Array,
      },
      'recipeId': {
        type: String,
        reflectToAttribute: true,
      },
      'recipeData': {
        type: String,
        reflectToAttribute: true,
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();

    const data = JSON.parse(this.recipeData);
    this.collections = []
    Object.entries(data.collections).forEach(entry => {
      const [key, value] = entry
      this.collections.push({
        key,
        value: value.recipes
      })
    })
  }
}

customElements.define('cookbook-body', Cookbook);