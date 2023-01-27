import { Component, Input, OnInit } from '@angular/core';
import { unitConversion } from 'src/app/unit-matcher';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {
  @Input('stars') stars = -1
  author?: string
  recipeName?: string
  forkLink?: string
  hashtags?: string
  ingredients?: any
  ingredientsArray?: any[]
  equipment?: string[]
  equipmentObj?: any[]
  cookTime = 0
  prepTime = 0
  data?: any
  @Input('recipe-id') recipeId?: string
  @Input('recipe-data') recipeData?: string
  @Input('file') file?: string
  sourceUrl?: string
  originalServings?: number

  getAllSteps() {
    const steps = this.data.steps ? this.data.steps : [];

    if (this.data.sections) {
      this.data.sections.forEach((section: { steps: any; }) => {
        steps.push(...section.steps);
      });
    }

    return steps;
  }

  ngOnInit() {
    if (!this.recipeId) return
    if (!this.recipeData) return
    const recipeElements = this.recipeId.split('/');

    if (recipeElements[0] === 'g') {
      // GitHub
      this.author = recipeElements[1];
      this.recipeName = recipeElements[2];
      this.forkLink = `https://github.com/${this.author}/${this.recipeName}`;
      this.sourceUrl = `https://github.com/${this.author}/${this.recipeName}/blob/master/${this.file}`;
    }

    this.data = JSON.parse(this.recipeData)
    this.originalServings = this.data.servings
    const {
      tags
    } = this.data;
    this.hashtags = tags.split(',').map((k: string) => `#${k.trim().replace(/\s/g, '')}`).join(' ') // I need one unified array of _every_ step in my recipe

    const steps = this.getAllSteps();
    steps.forEach((step: { prepTime: { unit: string; amount: number; }; cookTime: { unit: string; amount: number; }; ingredients: any[]; equipment: any[]; }) => {
      if (step.prepTime && step.prepTime.unit) {
        this.prepTime += unitConversion(step.prepTime.amount, step.prepTime.unit, 'minutes') ?? 0
      }

      if (step.cookTime && step.cookTime.unit) {
        this.cookTime += unitConversion(step.cookTime.amount, step.cookTime.unit, 'minutes') ?? 0
      }

      if (step.ingredients) {
        step.ingredients.forEach(ingredient => {
          if (this.ingredients[ingredient.item]) {
            if (ingredient.amount) {
              this.ingredients[ingredient.item].amount += unitConversion(ingredient.amount, ingredient.unit, this.ingredients[ingredient.item].unit);
            } else {
              this.ingredients[ingredient.item].min += unitConversion(ingredient.min, ingredient.unit, this.ingredients[ingredient.item].unit);
              this.ingredients[ingredient.item].max += unitConversion(ingredient.max, ingredient.unit, this.ingredients[ingredient.item].unit);
            }
          } else {
            this.ingredients[ingredient.item] = {
              item: ingredient.item,
              unit: ingredient.unit
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
          if (!this.equipment?.includes(equip.item)) {
            this.equipment?.push(equip.item);
          }
        });
      }
    }); // I need to remap every property, as JS by default will keep values as references to the original object
    // I do not want this, as I want the original values.

    this.ingredientsArray = Object.values(this.ingredients).map((i: any) => {
      return {
        item: i.item,
        unit: i.unit,
        amount: i.amount,
        min: i.min,
        max: i.max
      };
    })

    this.equipmentObj = this.equipment?.map(item => {
      return {
        link: `https://www.amazon.com/gp/search?ie=UTF8&tag=dishoutrecipe-20&linkCode=ur2&linkId=34869d5229e477ff1d706a9abb72c9c8&camp=1789&creative=9325&index=kitchen&keywords=${item}`,
        text: item
      }
    })
  }

  reserve() {
    window.requestAnimationFrame(() => {
      const count = this.data.servings
      if (this.data.servings <= 0 || isNaN(this.data.servings)) return; // We don't need that negativity in our cooking
      
      const original = this.originalServings!
      this.ingredientsArray?.forEach((ingredient) => {
        // This doesn't work directly.
        if (ingredient.amount) {
          ingredient.amount = this.ingredients[ingredient.item].amount * count / original;
        } else {
          ingredient.min = this.ingredients[ingredient.item].min * count / original;
          ingredient.max = this.ingredients[ingredient.item].max * count / original;
        }
      })
    })
  }

  generateRecipeContent() {
    return {
      "@context": "http://schema.org",
      "@type": "Recipe",
      "name": this.data.recipe,
      "image": this.data.prelude && this.data.prelude.images ? this.data.prelude.images.map((image: { src: any; }) => image.src) : undefined,
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
      "recipeIngredient": this.ingredientsArray?.map(ingredient => {
        let out = '';

        if (ingredient.amount) {
          out += ingredient.amount;

          if (ingredient.unit) {
            out += ` ${ingredient.unit} of`;
          }

          out += ` ${ingredient.item}`;
        } else {
          out += `${ingredient.min} - ${ingredient.max}`;

          if (ingredient.unit) {
            out += ` ${ingredient.unit} of`;
          }

          out += ` ${ingredient.item}`;
        }

        return out;
      }),
      "recipeInstructions": this.getAllSteps().map((step: { description: any; }) => {
        return {
          "@type": "HowToStep",
          "text": step.description
        };
      })
    };
  }
}
