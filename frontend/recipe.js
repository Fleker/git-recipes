import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/iron-icons.js';
import './carousel-image.js';
import './styled-card.js';
import './titlebar.js';
import './video-youtube.js';
import {unitConversion} from './unit-utils'

const quicklinks = {
  // Equipment
  "bowl": "https://www.amazon.com/gp/product/B01HTYH8YA/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B01HTYH8YA&linkId=4bae5378f1a9ef724cf92c459cd04d35",
  "mixing bowl": "https://www.amazon.com/gp/product/B003A4JFUE/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B003A4JFUE&linkId=a08fbca7b48f9a6978ccc8e4aea82106",
  "pan": "https://www.amazon.com/gp/product/B0732NXYNS/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B0732NXYNS&linkId=49b0d5a9c3c2111416e8fe55bf58d105",
  "whisk": "https://www.amazon.com/gp/product/B00004OCNS/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B00004OCNS&linkId=ff82852f8b6ebb6bbe4c95bd7db0b4bb",
  "saucepan": "https://www.amazon.com/gp/product/B06Y5KZCB2/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B06Y5KZCB2&linkId=a97a0bc1fced217282fe4466ceca83cd",
  "ramekins": "https://www.amazon.com/gp/product/B0176SPCYM/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B0176SPCYM&linkId=9cf7808ae7a14bf8f23f79282eacd0b9",
  "kitchen torch": "https://www.amazon.com/gp/product/B07L8YPYQK/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B07L8YPYQK&linkId=7242e675e2ed75da990fad35438fcceb",
  "torch": "https://www.amazon.com/gp/product/B07L8YPYQK/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B07L8YPYQK&linkId=7242e675e2ed75da990fad35438fcceb",
  "tea kettle": "https://www.amazon.com/gp/product/B00F9U0O20/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B00F9U0O20&linkId=7293a0a955b297b6ced1ff3050a84826",
  "kettle": "https://www.amazon.com/gp/product/B00F9U0O20/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B00F9U0O20&linkId=7293a0a955b297b6ced1ff3050a84826",
  "mug": "https://www.amazon.com/gp/product/B07Z4RYKJ8/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B07Z4RYKJ8&linkId=e19ee3e25d6f634c536f8ff2b7ed309a",
  "coffee mug": "https://www.amazon.com/gp/product/B07Z4RYKJ8/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B07Z4RYKJ8&linkId=e19ee3e25d6f634c536f8ff2b7ed309a",
  "dixie cups": "https://www.amazon.com/gp/product/B07WMYJPFW/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B07WMYJPFW&linkId=31e77b8681dbb346f8af85d5c5622fee",
  "omelet maker": "https://www.amazon.com/gp/product/B00OAO1MHW/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B00OAO1MHW&linkId=035d1f95c5b64a42ae589aba6f976292",
  "potato slicer": "https://www.amazon.com/gp/product/B00004OCIP/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B00004OCIP&linkId=b2ffb7011b13ff000e058b6a3cbf32fa",
  "potato peeler": "https://www.amazon.com/gp/product/B00004OCIP/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B00004OCIP&linkId=b2ffb7011b13ff000e058b6a3cbf32fa",
  "wooden spoon": "https://www.amazon.com/gp/product/B0000CCY1R/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B0000CCY1R&linkId=ccd9538281181a573f35158941f85c28",
  "spatula": "https://www.amazon.com/gp/product/B07ZLDZ2V2/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B07ZLDZ2V2&linkId=dd118bee63a3ee33623799c6f8376951",
  "rolling pin": "https://www.amazon.com/gp/product/B005D6GFFA/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B005D6GFFA&linkId=96d8e22c434dc92b6f89d6e9c1e67294",
  "food thermometer": "https://www.amazon.com/gp/product/B01IHHLB3W/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B01IHHLB3W&linkId=79b64c6f8de23214790576ae0e0adbb6",
  "meat thermometer": "https://www.amazon.com/gp/product/B01IHHLB3W/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B01IHHLB3W&linkId=79b64c6f8de23214790576ae0e0adbb6",
  "thermometer": "https://www.amazon.com/gp/product/B01IHHLB3W/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B01IHHLB3W&linkId=79b64c6f8de23214790576ae0e0adbb6",
  "can opener": "https://www.amazon.com/gp/product/B08T32X17X/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B08T32X17X&linkId=6947d65a860fbc89739a9277f6273875",
  "bottle opener": "https://www.amazon.com/gp/product/B08T32X17X/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B08T32X17X&linkId=6947d65a860fbc89739a9277f6273875",
  "parchment paper": "https://www.amazon.com/gp/product/B08W1VTD8J/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B08W1VTD8J&linkId=8493341daf19fd3a858f5dc00cd4a797",
  "tongs": "https://www.amazon.com/gp/product/B07TLNYFV7/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B07TLNYFV7&linkId=1c07f392066278207a351054b818377a",
  "cooking tongs": "https://www.amazon.com/gp/product/B07TLNYFV7/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B07TLNYFV7&linkId=1c07f392066278207a351054b818377a",
  "ladle": "https://www.amazon.com/gp/product/B08HYLVFDV/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B08HYLVFDV&linkId=adf6f70cd0c31d3e6db177a3f094be1f",
  "cheese grater": "https://www.amazon.com/gp/product/B0738C7RXF/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B0738C7RXF&linkId=bf407936163e98b079d0ed60775a76ec",
  "cheese slicer": "https://www.amazon.com/gp/product/B018MLW8MG/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B018MLW8MG&linkId=762314051b1d95a6f43e14c3a274976e",
  "avocado slicer": "https://www.amazon.com/gp/product/B08CS9C4MD/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B08CS9C4MD&linkId=6c8e6a0bf453d625510bcd1fe0659c22",
  "zester": "https://www.amazon.com/gp/product/B07WLGRTMT/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B07WLGRTMT&linkId=3c0651116d99d74bf67ca12502d86f02",
  "peeler": "https://www.amazon.com/gp/product/B00X597ZXS/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B00X597ZXS&linkId=9a01a1d078aa785feafd1ea19c8e1ff0",
  "vegetable peeler": "https://www.amazon.com/gp/product/B00X597ZXS/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B00X597ZXS&linkId=9a01a1d078aa785feafd1ea19c8e1ff0",
  "egg slicer": "https://www.amazon.com/gp/product/B00FYL4MY0/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B00FYL4MY0&linkId=4f8fb10693042e3c7ab37c8b0f543f5e",
  "scoop": "https://www.amazon.com/gp/product/B089PYC5DM/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B089PYC5DM&linkId=d43e43eeff1b3b2d8c1120a0cf97f9eb",
  "scooper": "https://www.amazon.com/gp/product/B089PYC5DM/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B089PYC5DM&linkId=d43e43eeff1b3b2d8c1120a0cf97f9eb",
  "ice cream scoop": "https://www.amazon.com/gp/product/B089PYC5DM/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B089PYC5DM&linkId=d43e43eeff1b3b2d8c1120a0cf97f9eb",
  "ice cream scooper": "https://www.amazon.com/gp/product/B089PYC5DM/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B089PYC5DM&linkId=d43e43eeff1b3b2d8c1120a0cf97f9eb",
  "cookie scooper": "https://www.amazon.com/gp/product/B07XF1NXMM/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B07XF1NXMM&linkId=4ef4c1de49f41772bc5edd520f4ffece",
  "nut cracker": "https://www.amazon.com/gp/product/B01N03605P/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B01N03605P&linkId=615e4c94ff6363cbb8373bc7d3733c67",
  "nutcracker": "https://www.amazon.com/gp/product/B01N03605P/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B01N03605P&linkId=615e4c94ff6363cbb8373bc7d3733c67",
  "egg separator": "https://www.amazon.com/gp/product/B076JFT2X4/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B076JFT2X4&linkId=00d129c4b36e515629a035bec381d91e",
  "honey dipper": "https://www.amazon.com/gp/product/B001APDFGU/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B001APDFGU&linkId=3e9dc252ee56c6728cf6920e21d7aa5d",
  "honey drizzler": "https://www.amazon.com/gp/product/B001APDFGU/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B001APDFGU&linkId=3e9dc252ee56c6728cf6920e21d7aa5d",
  "honey spoon": "https://www.amazon.com/gp/product/B001APDFGU/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B001APDFGU&linkId=3e9dc252ee56c6728cf6920e21d7aa5d",
  "crab mallet": "https://www.amazon.com/gp/product/B08CXRCXW3/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B08CXRCXW3&linkId=6d7140c841ffb2389bd7a36261412e4c",
  "oyster shucker": "https://www.amazon.com/gp/product/B07L9QTLNQ/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B07L9QTLNQ&linkId=251ed6c6320f9fb89dc9abbecbc4e476",
  "funnel": "https://www.amazon.com/gp/product/B08CS9FKV9/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B08CS9FKV9&linkId=fd0236d380d8ab4aca42aeccae3149bf",
}

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
        <ul><template is="dom-repeat" items="{{equipmentObj}}">
          <li>
            <template is="dom-if" if="{{item.link}}">
              <a href="{{item.link}}" target="_blank">
                [[item.text]]
              </a>
            </template>
            <template is="dom-if" if="{{!item.link}}">
              [[item.text]]
            </template>
          </li>
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
      'equipmentObj': {
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

    this.set('equipmentObj', this.equipment.map(item => {
      if (quicklinks[item.toLowerCase()]) {
        return {
          link: quicklinks[item.toLowerCase()],
          text: item,
        }
      }
      return {
        link: false,
        text: item,
      }
    }))
  }

  generateRecipeContent() {
    return {
      "@context": "http://schema.org",
      "@type": "Recipe",
      "name": this.data.recipe,
      "image": this.data.prelude && this.data.prelude.images ? this.data.prelude.images.map(image => image.src) : undefined,
      "author": {
        "@type": "Person",
        "name": this.data.author
      },
      "description": this.data.prelude ? this.data.prelude.description : '',
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
