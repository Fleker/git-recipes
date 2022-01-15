import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/iron-icons.js';
import './carousel-image.js';
import './styled-card.js';
import './titlebar.js';
import './video-youtube.js';

class RecipeStep extends PolymerElement {
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

        input {
          font-family: 'Roboto Slab', serif;
          width: 4em;
        }

        span.optional {
          font-style: italic;
          font-size: small;
        }
        </style>

        <ol>
          <template is="dom-repeat" items="{{steps}}">
            <li>
              <div class='direction'>
                <template is="dom-if" if="{{item.optional}}">
                  <span class="optional">Optional</span>
                </template>
                [[item.description]]<br>

                <template is="dom-repeat" items="{{item.images}}">
                  <br>
                  <carousel-image src="[[item.src]]" description="[[item.description]]"></carousel-image>
                </template>

                <template is="dom-if" if="{{item.videos}}">
                  <template is="dom-repeat" items="{{item.videos}}">
                    <br>
                    <player-youtube vid="[[item.youtube]]"></player-youtube>
                  </template>
                </template>

              </div>
            </li>
          </template>
        </ol>
    `;
  }
  static get properties() {
    return {
      steps: {
        type: Array,
        reflectToAttribute: true,
      }
    }
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }
}

customElements.define('recipe-steps', RecipeStep);
