import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { unitClassifier, unitConversion, unitMatch } from 'src/app/unit-matcher';

@Component({
  selector: 'recipe-unit',
  templateUrl: './recipe-unit.component.html',
  styleUrls: ['./recipe-unit.component.css']
})
export class RecipeUnitComponent implements OnInit {
  @Input('data') data?: {
    item: string
    min: number
    max: number
    unit: string
    amount: number
  }
  @Input('servings') servings?: number
  @ViewChild('dialog') dialog?: ElementRef
  prettyAmount?: number | string
  quickLink?: string
  initialData?: any
  initialServings?: number
  prettyUnit?: string
  measurementText?: string[]

  ngOnInit() {
    this.initialServings = this.servings
    this.initialData = {...this.data}
    this.prettyAmount = this.prettyPrint(this.data!.amount)
    this.prettyUnit = this.prettyPrintUnit(this.data!.amount)
    this.quickLink = (() => {
      return `https://www.amazon.com/gp/search?ie=UTF8&tag=dishoutrecipe-20&linkCode=ur2&linkId=34869d5229e477ff1d706a9abb72c9c8&camp=1789&creative=9325&index=kitchen&keywords=${this.data?.item}`
    })()
    setInterval(() => {
      // this is a really bad hack
      if (this.initialData.unit) {
        this.prettyAmount = this.prettyPrint(this.data!.amount)
        this.prettyUnit = this.prettyPrintUnit(this.data!.amount)
      } else {
        this.prettyAmount = Math.ceil(this.data!.amount)
      }
    }, 75)
  }

  prettyPrint(float: number = 0) {
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

  prettyPrintUnit(amount: number) {
    const baseUnit = unitMatch(this.data?.unit!)
    if (amount === 1) {
      return baseUnit
    }
    return `${baseUnit}s`
  }

  open() {
    if (this.data?.unit) {
      console.log(this.data?.unit)
      const classification = unitClassifier(this.data.unit)
      if (classification === 'liquid') {
        this.measurementText = [
          `${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'tsp'))} Tsp`,
          `${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'tbsp'))} Tbsp`,
          `${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'cup'))} Cup`,
          `${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'pint'))} Pt`,
          `${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'quart'))} Qt`,
          `${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'gallon'))} Gal`,
        ]
      } else if (classification === 'solid') {
        this.measurementText = [
          `${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'oz'))} oz`,
          `${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'lbs'))} lbs`,
          `${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'g'))} g`,
          `${this.prettyPrint(unitConversion(this.data.amount, this.data.unit, 'kg'))} kg`,
        ]
      }
      this.dialog!.nativeElement.showModal()
    }
  }

  close() {
    this.dialog!.nativeElement.close()
  }
}
