import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/iron-icons.js';
import './carousel-image.js';
import './video-youtube.js';

class Recipe extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
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
        }

        #card {
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

        #card h1 {
          margin-bottom: 0px;
        }

        #card h2 {
          font-size: 14pt;
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
      <table id='titlebar'><tr>
        <td class='left'>
          [[author]]/[[recipeName]]
        </td>
        <td class='right'>
          <iron-icon icon="star"></iron-icon> [[stars]]
          &emsp;
          <a href='[[forkLink]]' target='_blank'><iron-icon icon="create"></iron-icon></a>
        </td>
      </tr></table>
      <div id='card'>
        <h1>[[data.recipe]]</h1>
        <small>[[hashtags]]</small><br><br>
        <em>Recipe by [[data.author]]</em><br><br>
        Serves [[data.servings]]<br>
        Prep Time: [[prepTime]] min<br>
        Cook Time: [[cookTime]] min<br>
        <br>

        <template is="dom-repeat" items="{{data.prelude.images}}">
          <carousel-image src="[[item.src]]" description="[[item.description]]"></carousel-image>
        </template>

        <template is="dom-if" if="{{data.prelude.videos}}">
          <template is="dom-repeat" items="{{data.prelude.videos}}">
            <player-youtube vid="[[item.youtube]]"></player-youtube>
          </template>
        </template>
        
        <br><br>
        [[data.prelude.description]]

        <h2>Ingredients</h2>
        <ul><template is="dom-repeat" items="{{ingredients}}">
          <li>[[item]]</li>
        </template></ul>

        <h2>Equipment Needed</h2>
        <ul><template is="dom-repeat" items="{{equipment}}">
          <li>[[item]]</li>
        </template></ul>
        
        <h2>Directions</h2>
        <ol><template is="dom-repeat" items="{{data.steps}}">
          <li><div class='direction'>
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

          </div></li>
        </template></ol>
      </div>
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
      },
      'hashtags': {
        type: String,
      },
      'ingredients': {
        type: Array,
        value: [],
      },
      'equipment': {
        type: Array,
        value: [],
      },
      'cookTime': {
        type: Number,
        value: 0,
      },
      'prepTime': {
        type: Number,
        value: 0,
      },
      'data': {
        type: Object,
        value: {},
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

    const recipeElements = this.recipeId.split('/');
    if (recipeElements[0] === 'g') {
      // GitHub
      this.author = recipeElements[1];
      this.recipeName = recipeElements[2];
      this.forkLink = `https://github.com/${this.author}/${this.recipeName}`;
      this.stars = 5; // shrug
    }

    this.data = JSON.parse(this.recipeData);
    const {steps, tags} = this.data;
    this.hashtags = tags.split(',').map(k => `#${k.trim()}`).join(' ');

    steps.forEach(step => {
      this.cookTime += step.cookTime.amount;
      this.prepTime += step.prepTime.amount;
      step.ingredients.forEach(ingredient => {
        this.ingredients.push(`${ingredient.amount} ${ingredient.item}`);
      });
      step.equipment.forEach(equip => {
        if (!this.equipment.includes(equip.item)) {
          this.equipment.push(equip.item);
        }
      });
    })
  }
}

customElements.define('recipe-body', Recipe);