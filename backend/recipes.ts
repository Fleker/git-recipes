export interface Recipe {
  author: string
  recipe: string
  spec: string
  tags: string
  servings: number
  prelude: {
    description: string
    images: Image[]
    videos: Video[]
  }
  steps: Step[]
}

interface Image {
  src: string
  description: string
}

interface Video {
  /**
   * YouTube video ID
   */
  youtube?: string
}

interface Step {
  description: string
  ingredients?: Array<PreciseIngredient | MeasuredIngredient | RangedIngredient>
  equipment?: Equipment[]
  prepTime?: Time
  cookTime?: Time
  images?: Image[]
}

interface Ingredient {
  item: string
}

interface PreciseIngredient extends Ingredient {
  amount: number
}

interface MeasuredIngredient extends Ingredient {
  amount: number
  unit: Unit
}

interface RangedIngredient extends Ingredient {
  min: number
  max: number
  unit: Unit
}

interface Equipment {
  item: string
}

interface Time {
  amount: number
  unit: UnitTime
}

export interface Cookbook {
  recipes: Record<string, string>
  collections: Record<string, RecipeList>
}

interface RecipeList {
  recipes: {
    key: string
    label: string
  }[]
}

type Unit = 'cup' | 'cups' |
  'tablespoon' | 'tablespoons' | 'tbsp' |
  'teaspoon' | 'teaspoons' | 'tsp'

type UnitTime = 'minute' | 'minutes' | 'min' | 'm' |
  'second' | 'seconds' | 'sec' | 's' |
  'hour' | 'hours' | 'hr' | 'h'
