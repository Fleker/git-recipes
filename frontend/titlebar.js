import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/iron-icons.js';

const unhearted = 'favorite-border'
const hearted = 'favorite'

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

        iron-icon {
          cursor: pointer;
        }

        iron-icon:hover {
          background-color: rgba(0, 0, 0, 0.3);
        }

        iron-icon:focus {
          background-color: rgba(0, 0, 0, 0.5);
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
          <iron-icon icon$="{{hearted}}" id="btn-heart"></iron-icon>
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
      },
      label: {
        type: String,
        reflectToAttribute: true,
      },
      hearted: {
        type: String,
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

    this.hearted = this.hasHearted() > -1 ? hearted : unhearted
    const url = window.location.pathname
    console.log('Got', url)
      this.$['btn-heart'].onclick = () => {
      const label = this.label ? this.label : this.recipeId
      console.log('Heart this item!', url, label)
      if (localStorage.getItem('favorites')) {
        const localFavorites = JSON.parse(localStorage.getItem('favorites'))
        const recipeIndex = this.hasHearted()
        if (recipeIndex > -1) {
          // We already have it saved.
          // Toggle.
          localFavorites.splice(recipeIndex, 1)
          this.hearted = unhearted
        } else {
          localFavorites.push({url, label})
          this.hearted = hearted
        }
        localStorage.setItem('favorites', JSON.stringify(localFavorites))
      } else {
        localStorage.setItem('favorites', JSON.stringify([{url, label}]))
      }
      console.info('Updated favorites list!')
    }
  }

  hasHearted() {
    const url = window.location.pathname
    if (localStorage.getItem('favorites')) {
      const localFavorites = JSON.parse(localStorage.getItem('favorites'))
      return localFavorites.findIndex(v => v.url === url)
    }
    return -1
  }
}

customElements.define('title-bar', TitleBar);
