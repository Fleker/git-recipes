import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class FavoritesList extends PolymerElement {
  static get template() {
    return html`
      <styled-card>
        <h1>My Favorites</h1>
        <template is="dom-if" if="{{!favorites}}">
          <small>
              When you 'heart' a recipe or cookbook, it will be saved in your local browser.
          </small>
        </template>

        <ul>
            <template is="dom-repeat" items="{{favorites}}">
                <li>
                    <a href$="{{item.url}}">{{item.label}}</a>
                </li>
            </template>
        </ul>
    </styled-card>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    console.log('Connected to favorites list')
    if (localStorage.getItem('favorites')) {
      console.log('Load favorites item')
      this.set('favorites', JSON.parse(localStorage.getItem('favorites')))
    }
  }
}

customElements.define('favorites-list', FavoritesList);