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

        a.small {
          font-size: small;
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
        <h2>Full List</h2>
        <ul>
        <template is="dom-repeat" items="{{allRecipes}}">
          <li><a href="/[[recipeId]]/[[item.key]]" class="small">[[item.key]]</a></li>
        </template>
        </ul>
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
      'allRecipes': {
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
    this.allRecipes = []
    Object.entries(data.recipes).forEach(entry => {
      const [key, value] = entry
      this.allRecipes.push({
        key,
      })
    })
  }
}

customElements.define('cookbook-body', Cookbook);