import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { unitClassifier, unitConversion, unitMatch } from './unit-utils';

class RecipeUnit extends PolymerElement {
  static get template() {
    return html`
    <style>
      #box {
        cursor: pointer;
      }
    </style>
    <span id="box">
      <template is="dom-if" if="{{data.amount}}">
        [[prettyAmount]]
        <template is="dom-if" if="{{data.unit}}">
          [[prettyUnit]] of
        </template>
        <template is="dom-if" if="{{quickLink}}">
          <a href="{{quickLink}}" target="_blank">
            [[data.item]]
          </a>
        </template>
        <template is="dom-if" if="{{!quickLink}}">
          [[data.item]]
        </template>
      </template>
      <template is="dom-if" if="{{data.min}}">
        [[data.min]]
        -
        [[data.max]]
        <template is="dom-if" if="{{data.unit}}">
          [[prettyUnit]] of
        </template>
        <template is="dom-if" if="{{quickLink}}">
          <a href="{{quickLink}}" target="_blank">
            [[data.item]]
          </a>
        </template>
        <template is="dom-if" if="{{!quickLink}}">
          [[data.item]]
        </template>
      </template>
    </span>

    <dialog id="dialog">
      <strong>~ {{data.unit}} ~</strong>
      <br>
      <div id="dialog-txt"></div>
      <button id="dialog-btn">Close</button>
    </dialog>
    `
  }

  static get properties() {
    return {
      data: {
        type: Object,
        properties: {
          item: {
            type: String
          },
          min: {
            type: Number
          },
          max: {
            type: Number
          },
          unit: {
            type: String
          }
        }
      },
      prettyAmount: {
        type: String
      },
      quickLink: {
        type: String
      },
      servings: {
        type: Number,
        // observer: '_servingsChanged',
      }
    }
  }

  static get observers() {
    return [
        // '_dataChanged(data.amount, data.min, data.max)'
    ]
  }

  prettyPrint(float) {
    const remainder = float - Math.floor(float)
    const fraction = (() => {
      if (remainder < 1/16) { // 0.0625
        return ''
      } else if (remainder <= 1/8) { // 0.125
        return `¹/₈`
      } else if (remainder <= 1/6) { // 0.167
        return `¹/₆`
      } else if (remainder <= 1/4) { // 0.25
        return `¹/₄`
      } else if (remainder <= 1/3) { // 0.33
        return `¹/₃`
      } else if (remainder <= 3/8) { // 0.375
        return `³/₈`
      } else if (remainder <= 1/2) { // 0.5
        return `¹/₂`
      } else if (remainder <= 5/8) { // 0.625
        return `⁵/₈`
      } else if (remainder <= 2/3) { // 0.67
        return `²/₃`
      } else if (remainder <= 3/4) { // 0.75
        return `³/₄`
      } else if (remainder <= 5/6) { // 0.833
        return `⁵/₆`
      } else {
        return `⁷/₈` // 0.875
      }
    })()
    if (Math.floor(float)) {
      return `${Math.floor(float)} ${fraction}`
    }
    return `${fraction}`
  }

  prettyPrintUnit(amount) {
    const baseUnit = unitMatch(this.data.unit)
    if (amount === 1) {
      return baseUnit
    }
    return `${baseUnit}s`
  }

  connectedCallback() {
    super.connectedCallback()
    this.initialServings = this.servings
    this.initialData = {...this.data}
    this.prettyAmount = this.prettyPrint(this.data.amount)
    this.prettyUnit = this.prettyPrintUnit(this.data.amount)
    this.quickLink = (() => {
      if (quicklinks[this.data.item.toLowerCase()]) {
        return quicklinks[this.data.item.toLowerCase()]
      }
      return `https://www.amazon.com/gp/search?ie=UTF8&tag=dishoutrecipe-20&linkCode=ur2&linkId=34869d5229e477ff1d706a9abb72c9c8&camp=1789&creative=9325&index=kitchen&keywords=${this.data.item}`
    })()
    this.$['dialog-btn'].onclick = () => {
      this.$.dialog.close()
    }
    this.$.box.onclick = () => {
      if (this.data.unit) {
        const classification = unitClassifier(this.data.unit)
        if (classification === 'liquid') {
          const measurement = `
            ${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'tsp'))} Tsp<br>
            ${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'tbsp'))} Tbsp<br>
            ${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'cup'))} Cup<br>
            ${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'pint'))} Pt<br>
            ${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'quart'))} Qt<br>
            ${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'gallon'))} Gal<br>
          `
          this.$['dialog-txt'].innerHTML = measurement
        } else if (classification === 'solid') {
          const measurement = `
            ${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'oz'))} oz<br>
            ${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'lbs'))} lbs<br>
            ${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'g'))} g<br>
            ${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'kg'))} kg<br>
            `
          this.$['dialog-txt'].innerHTML = measurement
        }
        this.$.dialog.showModal()
      }
    }
    setInterval(() => {
      // this is a really bad hack
      if (this.initialData.unit) {
        this.prettyAmount = this.prettyPrint(this.data.amount)
        this.prettyUnit = this.prettyPrintUnit(this.data.amount)
      } else {
        this.prettyAmount = Math.ceil(this.data.amount)
      }
    }, 75)
  }
}

customElements.define('recipe-unit', RecipeUnit);

const quicklinks = {
  // Ingredients
  "bacon": "https://www.amazon.com/gp/product/B07WYKQBSC/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B07WYKQBSC&linkId=d22637119ac12f30a9a1a6aaefda1e2b",
  "bacon clices": "https://www.amazon.com/gp/product/B07WYKQBSC/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B07WYKQBSC&linkId=d22637119ac12f30a9a1a6aaefda1e2b",
  "egg": "https://www.amazon.com/gp/product/B0018AIF8A/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B0018AIF8A&linkId=b9bc072a83aaf7714f18cb99bf57f968",
  "eggs": "https://www.amazon.com/gp/product/B0018AIF8A/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B0018AIF8A&linkId=b9bc072a83aaf7714f18cb99bf57f968",
  "flour": "https://www.amazon.com/gp/product/B00H8WLHKU/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B00H8WLHKU&linkId=8c51116110f441c4d59389e535972d35",
  "all-purpose flour": "https://www.amazon.com/gp/product/B00H8WLHKU/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B00H8WLHKU&linkId=8c51116110f441c4d59389e535972d35",
  "sugar": "https://www.amazon.com/gp/product/B00ASDT8A2/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B00ASDT8A2&linkId=61722cb404833f2ccb158fc1f1deeeaf",
  "granulated sugar": "https://www.amazon.com/gp/product/B00ASDT8A2/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B00ASDT8A2&linkId=61722cb404833f2ccb158fc1f1deeeaf",
  "vinegar": "https://www.amazon.com/gp/product/B07985NMQD/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B07985NMQD&linkId=7e1135a968e1a71a9ec8ec1c817cc8e7",
  "salt": "https://www.amazon.com/gp/product/B0714B7FTK/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B0714B7FTK&linkId=0460a80386375ae1908608ecd08c0648",
  "vanilla": "https://www.amazon.com/gp/product/B0046EJ570/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B0046EJ570&linkId=ae3474bbfabe5bae85d25e3c255aa7ac",
  "vanilla extract": "https://www.amazon.com/gp/product/B0046EJ570/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B0046EJ570&linkId=ae3474bbfabe5bae85d25e3c255aa7ac",
  "jello": "https://www.amazon.com/gp/product/B00AU4P04W/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B00AU4P04W&linkId=204f12cb8e72b567c17929806c68e244",
  "jello mix": "https://www.amazon.com/gp/product/B00AU4P04W/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B00AU4P04W&linkId=204f12cb8e72b567c17929806c68e244",
  "powdered sugar": "https://www.amazon.com/gp/product/B00LPX1KS2/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B00LPX1KS2&linkId=afef0e745f7edfa11488d5d8d7042d26",
  "peanut butter": "https://www.amazon.com/gp/product/B00PJCYOWE/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=dishoutrecipe-20&creative=9325&linkCode=as2&creativeASIN=B00PJCYOWE&linkId=f9823cd26d1d36f1c6ec75906f41c895",
}
