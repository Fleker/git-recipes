const liquid = ['tsp', 'tbsp', 'cup', 'pint', 'quart', 'gallon']
const solid = ['g', 'kg', 'lbs', 'oz']

export function unitClassifier(unitIn: string) {
  const match = unitMatch(unitIn)
  if (!match) return
  if (liquid.includes(match)) return 'liquid'
  if (solid.includes(match)) return 'solid'
  return
}

export function unitMatch(unitIn?: string) {
  if (!unitIn) return undefined
  switch (unitIn.toLowerCase()) {
    // Liquid measurements
    case 'teaspoon':
    case 'teaspoons':
    case 'tsp':
    case 'tsps':
      return 'tsp';
    case 'tablespoon':
    case 'tablespoons':
    case 'tbsp':
    case 'tbsps':
      return 'tbsp';
    case 'cup':
    case 'cups':
      return 'cup';
    case 'pint':
    case 'pints':
    case 'pt':
      return 'pint';
    case 'quart':
    case 'quarts':
    case 'qt':
      return 'quart';
    case 'gallon':
    case 'gallons':
    case 'gal':
      return 'gallon';

    // Solid measurements
    case 'oz':
    case 'ounce':
    case 'ounces':
      return 'oz';
    case 'lbs':
    case 'pound':
    case 'pounds':
      return 'lbs';
    case 'g':
    case 'gram':
    case 'grams':
      return 'g'
    case 'kg':
    case 'kilogram':
    case 'kilograms':
      return 'kg';
    
    // Time
    case 'second':
    case 'seconds':
    case 'sec':
    case 's':
      return 'second';
    case 'minute':
    case 'minutes':
    case 'min':
    case 'm':
      return 'minute';
    case 'hour':
    case 'hours':
    case 'hr':
    case 'hrs':
    case 'h':
      return 'hour';
  }
  return
}

export function unitConversion(valueIn: number, unitIn: string, unitOut: string) {
  const uin = unitMatch(unitIn)
  const uout = unitMatch(unitOut)
  if (!uin || !uout) return
  const cin = conversionMap[uin] as any
  const cval = cin[uout]
  return valueIn * cval
}

export const conversionMap = {
  tsp: {
    tsp: 1,
    tbsp: 1/3,
    cup: 1/48.692,
    pint: 1/96,
    quart: 1/192,
    gallon: 1/768,
  },
  tbsp: {
    tsp: 3,
    tbsp: 1,
    cup: 1/16.231,
    pint: 1/32,
    quart: 1/64,
    gallon: 1/256,
  },
  cup: {
    tsp: 48.692,
    tbsp: 16.231,
    cup: 1,
    pint: 1/1.972,
    quart: 1/3.943,
    gallon: 0.0634013
  },
  pint: {
    tsp: 96,
    tbsp: 32,
    cup: 1.972,
    pint: 1,
    quart: 2,
    gallon: 8,
  },
  quart: {
    tsp: 192,
    tbsp: 64,
    cup: 3.943,
    pint: 1/2,
    quart: 1,
    gallon: 4,
  },
  gallon: {
    tsp: 768,
    tbsp: 256,
    cup: 1/0.0634013,
    pint: 8,
    quart: 4,
    gallon: 1,
  },

  oz: {
    oz: 1,
    lbs: 0.0625,
    g: 28.3495,
    kg: 0.0283495,
  },
  lbs: {
    oz: 16,
    lbs: 1,
    g: 453.592,
    kg: 0.453592,
  },
  g: {
    oz: 0.035274,
    lbs: 0.00220462,
    g: 1,
    kg: 0.001,
  },
  kg: {
    oz: 35.274,
    lbs: 2.20462,
    g: 1000,
    kg: 1,
  },

  second: {
    second: 1,
    minute: 1/60,
    hour: 1/3600,
  },
  minute: {
    second: 60,
    minute: 1,
    hour: 60,
  },
  hour: {
    second: 3600,
    minute: 60,
    hour: 1,
  },
}