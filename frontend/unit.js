import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { unitConversion, unitMatch } from './unit-utils';

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
        [[data.item]]
      </template>
      <template is="dom-if" if="{{data.min}}">
        [[data.min]]
        -
        [[data.max]]
        <template is="dom-if" if="{{data.unit}}">
          [[prettyUnit]] of
        </template>
        [[data.item]]
      </template>
    </span>
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
    console.log(this.initialServings)
    this.prettyAmount = this.prettyPrint(this.data.amount)
    this.prettyUnit = this.prettyPrintUnit(this.data.amount)
    this.$.box.onclick = () => {
      console.log(this.amount, this.data.unit)
      if (this.data.unit) {
        const measurement = `
          ~ ${this.data.item} ~
          ${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'tsp'))} Tsp
          ${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'tbsp'))} Tbsp
          ${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'cup'))} Cup
          ${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'pint'))} Pt
          ${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'quart'))} Qt
          ${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'gallon'))} Gal
        `
        alert(measurement)
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
