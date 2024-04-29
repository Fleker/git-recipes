import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GanttDate, GanttItem, GanttViewOptions, GanttViewType, NgxGanttComponent, registerView } from '@worktile/gantt';
import { unitConversion } from 'src/app/unit-matcher';
import { GanttViewCustom } from './GanttCustomView';

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
  ingredients: any = {}
  ingredientsArray?: any[]
  equipment: string[] = []
  equipmentObj?: any[]
  cookTime = 0
  prepTime = 0
  data?: any
  @Input('recipe-id') recipeId?: string
  @Input('file') file?: string
  @ViewChild('gantt') gantt?: NgxGanttComponent
  sourceUrl?: string
  originalServings?: number
  ganttItems: GanttItem[] = []
  ganttViewType: GanttViewType = GanttViewType.day
  ganttViewOptions: GanttViewOptions = {
    start: new GanttDate().addMinutes(-30),
    end: new GanttDate().addHours(1),
    min: new GanttDate().addMinutes(-31),
    max: new GanttDate().addHours(1).addMinutes(1),
    cellWidth: 300,
    dateFormat: {
      week: 'w',
      month: 'M',
      quarter: 'QQQ',
      year: 'yyyy',
      yearMonth: 'yyyy MM',
      yearQuarter: 'yyyy QQQ',
      // yearMonth: '',
      // yearQuarter: '',
    }
  }

  constructor(private route: ActivatedRoute) {}

  async load(author: string, recipeName: string, file: string) {
    const res = await fetch(`https://git-recipes.uc.r.appspot.com/api/g/${author}/${recipeName}/${file}`)
    const rdata = await res.json()
    this.file = rdata.fileLocation
    this.stars = rdata.stars
    this.data = rdata.recipeJson

    if (!this.recipeId) return
    const recipeElements = this.recipeId.split('/');

    if (recipeElements[0] === 'g') {
      // GitHub
      this.author = recipeElements[1];
      this.recipeName = recipeElements[2];
      this.forkLink = `https://github.com/${this.author}/${this.recipeName}`;
      this.sourceUrl = `https://github.com/${this.author}/${this.recipeName}/blob/master/${this.file}`;
    }

    this.originalServings = this.data.servings
    const { tags } = this.data;
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

    let timeNow = Date.now()
    this.ganttItems = steps.map((step: any, i: number) => {
      const entry: GanttItem = {
        id: i.toString(),
        title: step.description,
        start: timeNow / 1000,
        expandable: false,
      }
      if (step.prepTime && step.prepTime.unit) {
        timeNow += unitConversion(step.prepTime.amount, step.prepTime.unit, 'minutes')!*60_000 ?? 0
      }
      if (step.cookTime && step.cookTime.unit) {
        timeNow += unitConversion(step.cookTime.amount, step.cookTime.unit, 'minutes')!*60_000 ?? 0
      }
      entry.end = timeNow / 1000
      if (i > 0) {
        entry.links = [(i - 1).toString()]
      }
      return entry
    });
    // registerView('custom', GanttViewCustom);
    // (this.gantt! as any).viewType = 'custom'
    this.gantt!.view = new GanttViewCustom({date: new GanttDate()}, {date: new GanttDate(timeNow)}, this.ganttItems)
    setTimeout(() => {
      this.gantt!.detectChanges()
      this.gantt!.rerenderView()
    }, 500)

    this.ingredientsArray = Object.values(this.ingredients).map((i: any) => {
      return {
        item: i.item,
        unit: i.unit,
        amount: i.amount,
        min: i.min,
        max: i.max
      };
    })

    console.log(this.equipment)
    this.equipmentObj = this.equipment?.map(item => {
      return {
        link: `https://www.amazon.com/gp/search?ie=UTF8&tag=dishoutrecipe-20&linkCode=ur2&linkId=34869d5229e477ff1d706a9abb72c9c8&camp=1789&creative=9325&index=kitchen&keywords=${item}`,
        text: item
      }
    })
    this.generateRecipeContent()
  }

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
    this.route.paramMap.subscribe(params => {
      console.log(params)
      const author = params.get('profile')!
      const recipeName = params.get('repo')!
      const file = params.get('file')!
      this.recipeId = window.location.pathname
      this.load(author, recipeName, file)
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
    const jsonLd = {
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
    // Insert in BODY
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'recipeContent'
    script.innerHTML = JSON.stringify(jsonLd)
    document.querySelector('body')?.appendChild(script)
  }

  fahrenheit(celsius: number) {
    return (celsius * 9 / 5) + 32
  }
}
