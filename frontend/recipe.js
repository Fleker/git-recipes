import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/iron-icons.js';
import './carousel-image.js';
import './styled-card.js';
import './titlebar.js';
import './video-youtube.js';
import {unitConversion} from './unit-utils'

class Recipe extends PolymerElement {
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

        </style>
      <title-bar stars='[[stars]]' recipe-id='[[recipeId]]'></title-bar>
      <styled-card>
        <h1>[[data.recipe]]</h1>
        <small>[[hashtags]]</small><br><br>
        <em>Recipe by [[data.author]]</em><br><br>
        Serves
        <input type="number" id="servings" value$="[[data.servings]]" min="1" />
        <br>
        Prep Time: [[prepTime]] min<br>
        <template is="dom-if" if="{{cookTime}}">
          Cook Time: [[cookTime]] min<br>
        </template>
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
        <ul>
          <template is="dom-repeat" items="{{ingredientsArray}}" id="ingredients-repeat" indexAs="index">
            <li>
              <recipe-unit data="{{item}}" servings="{{data.servings}}"></recipe-unit>
            </li>
          </template>
        </ul>

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
      </styled-card>

      <script type="application/ld+json" id="recipeContent"></script>
    `;
  }
  static get properties() {
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
      'hashtags': {
        type: String,
      },
      'ingredients': {
        type: Object,
        value: {},
      },
      'ingredientsArray': {
        type: Array,
        value: []
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

  constructor() {
    super();
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

    this.data = JSON.parse(this.recipeData);
    const {steps, tags} = this.data;
    this.hashtags = tags.split(',').map(k => `#${k.trim().replace(/\s/g, '')}`).join(' ');

    steps.forEach(step => {
      if (step.prepTime && step.prepTime.unit) {
        this.prepTime += unitConversion(
            step.prepTime.amount, 
            step.prepTime.unit,
            'minutes',
        );
      }
      if (step.cookTime && step.cookTime.unit) {
        this.cookTime += unitConversion(
            step.cookTime.amount, 
            step.cookTime.unit,
            'minutes',
        );
      }

      if (step.ingredients) {
        step.ingredients.forEach(ingredient => {
          if (this.ingredients[ingredient.item]) {
            if (ingredient.amount) {
              this.ingredients[ingredient.item].amount += unitConversion(
                  ingredient.amount, 
                  ingredient.unit,
                  this.ingredients[ingredient.item].unit,
              );
            } else {
              this.ingredients[ingredient.item].min += unitConversion(
                  ingredient.min, 
                  ingredient.unit,
                  this.ingredients[ingredient.item].unit,
              );
              this.ingredients[ingredient.item].max += unitConversion(
                  ingredient.max, 
                  ingredient.unit,
                  this.ingredients[ingredient.item].unit,
            );
            }
          } else {
            this.ingredients[ingredient.item] = {
              item: ingredient.item,
              unit: ingredient.unit,
            };
            if (ingredient.amount) {
              this.ingredients[ingredient.item].amount = ingredient.amount;
            } else {
              this.ingredients[ingredient.item].min = ingredient.min;
              this.ingredients[ingredient.item].max = ingredient.max;
            }
          }
        });
      }
      if (step.equipment) {
        step.equipment.forEach(equip => {
          if (!this.equipment.includes(equip.item)) {
            this.equipment.push(equip.item);
          }
        });
      }
    });
    // I need to remap every property, as JS by default will keep values as references to the original object
    // I do not want this, as I want the original values.
    this.ingredientsArray = Object.values(this.ingredients).map(i => {
      return {
        item: i.item,
        unit: i.unit,
        amount: i.amount,
        min: i.min,
        max: i.max
      }
    })

    this.$.recipeContent.innerHTML = JSON.stringify(this.generateRecipeContent())

    // Automatically adjust the ingredient counts for the number of desired servings
    this.$.servings.oninput = (event) => {
      const count = parseInt(event.path[0].value)
      if (count <= 0 || isNaN(count)) return; // We don't need that negativity in our cooking
      const original = parseInt(event.path[0].defaultValue)
      this.ingredientsArray.forEach((ingredient, index) => {
        // This doesn't work directly.
        if (ingredient.amount) {
          ingredient.amount = this.ingredients[ingredient.item].amount * count / original
        } else {
          ingredient.min = this.ingredients[ingredient.item].min * count / original
          ingredient.max = this.ingredients[ingredient.item].max * count / original
        }
      })
      this.notifySplices('ingredientsArray')
    }
  }

  generateRecipeContent() {
    return {
      "@context": "http://schema.org",
      "@type": "Recipe",
      "name": this.data.recipe,
      "image": this.data.prelude.images ? this.data.prelude.images.map(image => image.src) : undefined,
      "author": {
        "@type": "Person",
        "name": this.data.author
      },
      "description": this.data.prelude.description,
      "prepTime": `PT${this.prepTime}M`,
      "cookTime": `PT${this.cookTime}M`,
      "totalTime": `PT${this.prepTime + this.cookTime}M`,
      "recipeYield": `${this.data.servings} servings`,
      "keywords": this.data.tags,
      "recipeIngredient": this.ingredientsArray.map(ingredient => {
        let out = ''
        if (ingredient.amount) {
          out += ingredient.amount
          if (ingredient.unit) {
            out += ` ${ingredient.unit} of`
          }
          out += ` ${ingredient.item}`
        } else {
          out += `${ingredient.min} - ${ingredient.max}`
          if (ingredient.unit) {
            out += ` ${ingredient.unit} of`
          }
          out += ` ${ingredient.item}`
        }
        return out
      }),
      "recipeInstructions": this.data.steps.map(step => {
        return {
          "@type": "HowToStep",
          "text": step.description
        }
      })
    }
  }

  // https://polymer-library.polymer-project.org/3.0/docs/devguide/data-binding#bind-array-item
  arrayItem(change, index, path) {
    // this.get(path, root) returns a value for a path
    // relative to a root object.
    return this.get(path, change.base[index]);
  }
}

customElements.define('recipe-body', Recipe);