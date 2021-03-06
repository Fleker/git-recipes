import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/iron-icons.js';

class TitleBar extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
          position: sticky;
          top: 0;
          z-index: 2;
        }

        #titlebar {
          width: 100vw;
          padding-left: 48px;
          padding-top: 4px;
          padding-bottom: 4px;
          background-color: #f0f0f0;
          border-bottom: solid 1px #ababab;
        }

        #titlebar .right {
          text-align: right;
          padding-right: 24px;
        }

        #titlebar a {
          color: black;
          text-decoration: none;
        }

        </style>
      <table id='titlebar'><tr>
        <td class='left'>
          [[author]]/[[recipeName]]
          <a href="/g/[[author]]/[[recipeName]]">
            <iron-icon icon="folder-open"></iron-icon>
          </a>
        </td>
        <td class='right'>
          <a href='[[forkLink]]/stargazers' target='_blank'>
            <iron-icon icon="star"></iron-icon> [[stars]]
          </a>
          &emsp;
          <a href='[[forkLink]]' target='_blank'><iron-icon icon="create"></iron-icon></a>
        </td>
      </tr></table>
    `;
  }
  static get properties () {
    return {
      'author': {
        type: String,
      },
      'recipeName': {
        type: String,
      },
      'forkLink': {
        type: String,
      },
      'stars': {
        type: Number,
        reflectToAttribute: true,
      },
      'recipeId': {
        type: String,
        reflectToAttribute: true,
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();

    const recipeElements = this.recipeId.split('/');
    if (recipeElements[0] === 'g') {
      // GitHub
      this.author = recipeElements[1];
      this.recipeName = recipeElements[2];
      this.forkLink = `https://github.com/${this.author}/${this.recipeName}`;
    }
  }
}

customElements.define('title-bar', TitleBar);