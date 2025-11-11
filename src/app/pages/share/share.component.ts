import { Component, Input, OnInit, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { unitConversion } from 'src/app/unit-matcher';
import apiKey from '../../gemini'

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {
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
  sourceUrl?: string
  originalServings?: number
  loadurl = 'https://www.tiktok.com/@stealth_health_life/video/7433199223354510622'
  parsedRecipe: WritableSignal<any> = signal(undefined)
  parsedRecipeString = signal('')
  processingState = signal('')
  link = signal('')

  constructor(private route: ActivatedRoute, public auth: AngularFireAuth, private firestore: AngularFirestore) {
    if (typeof window !== 'undefined') {
                const urlParams = new URLSearchParams(window.location.search);
                const recipeData = urlParams.get('recipe');
                if (recipeData) {
                    try {
                        const decodedJson = atob(recipeData);
                        const recipe = JSON.parse(decodedJson);
                        this.parsedRecipe.set(recipe);
                        this.load(this.parsedRecipe(), 'null', 'null', 'null')
                    } catch (error) {
                        console.error("Failed to parse recipe from URL:", error);
                        alert('Could not load recipe from URL.');
                    }
                }
            }
  }

  async letsgo() {
    console.log(this.loadurl)
    // eg. https://www.tiktok.com/@stealth_health_life/video/7433199223354510622
    await this.parseUrl(this.loadurl)
  }
  
async parseUrl(url: string) {
        if (!url || !url.startsWith('http')) {
            alert('Please enter a valid URL.');
            return;
        }
        this.processingState.set('Fetching video...');

        try {
            // 1. Fetch the raw description from the URL
            const description = await this.fetchUrlDescription(url);
             if (!description) {
                throw new Error("Could not retrieve a description from the URL.");
            }
            this.processingState.set('Processing video...');

            // 2. Call Gemini API to transform the description
            const recipeJson = await this.transformWithGemini(description, url);
            this.parsedRecipe.set(recipeJson);
            this.parsedRecipeString.set(JSON.stringify(recipeJson, null, 2));
            this.load(recipeJson, 'null', 'null', 'null')
        } catch (error: any) {
            console.error("Error parsing URL:", error);
            alert(error.message);
        } finally {
            this.processingState.set('');
        }
    }

      /**
     * Fetches the video/post description from a given URL.
     * NOTE: In a real-world application, this function would make a call to a dedicated backend proxy server.
     * Direct client-side requests to third-party sites like TikTok or Instagram are blocked by browser CORS policies.
     * @param url The URL of the TikTok video or Instagram post.
     * @returns A promise that resolves to the description string.
     */
    async fetchUrlDescription(url: string): Promise<string | null> {
        console.log(`Fetching description for: ${url}`);
        const res = await fetch(`https://us-central1-redside-shiner.cloudfunctions.net/fetch_description?url[]=${url}`)
        return (await res.json())[0];
    }

 async transformWithGemini(description: string, sourceUrl: string): Promise<any> {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        // The JSON schema provided in the prompt.
        const schema = {
            type: "OBJECT",
            properties: {
                author: { type: "STRING" },
                recipe: { type: "STRING" },
                spec: { type: "STRING", enum: ["v0.1.2"] },
                tags: { type: "STRING" },
                servings: { type: "NUMBER" },
                prelude: {
                    type: "OBJECT",
                    properties: { description: { type: "STRING" } }
                },
                steps: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            description: { type: "STRING" },
                            ingredients: {
                                type: "ARRAY",
                                items: {
                                    type: "OBJECT",
                                    properties: {
                                        item: { type: "STRING" },
                                        amount: { type: "NUMBER" },
                                        unit: { type: "STRING" }
                                    }
                                }
                            }
                        }
                    }
                },
                metadata: {
                   type: "OBJECT",
                   properties: {
                       originalUrl: { type: "STRING" }
                   }
                }
            }
        };

        const prompt = `
            Parse the following recipe description from a social media video and convert it into the provided JSON schema.
            Infer the author from the video context if possible, otherwise use the channel name.
            The recipe title should be descriptive. Set the spec to "v0.1.2".
            Extract tags from the hashtags. Determine the number of servings.
            The prelude description should be a brief, friendly intro.
            List all ingredients under their corresponding first step where they are used.
            Add the original video URL to the metadata.

            Description:
            ---
            ${description}
            ---

            Source URL: ${sourceUrl}
        `;

        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const result = await response.json();
        const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!jsonText) {
            throw new Error("No JSON content returned from Gemini.");
        }
        console.debug(jsonText)
        
        return JSON.parse(jsonText);
    }

downloadYaml() {
      // Turns the recipeJson into a YAML file and download it
      if (!this.parsedRecipe()) return;
      // Download parsedRecipe as file
      // const filename = `${this.parsedRecipe()?.recipe.toLowerCase().replace(/\s+/g, '-')}.yaml`;
      const filename = `${this.parsedRecipe()?.recipe.toLowerCase().replace(/\s+/g, '-')}.json`;
      const element = document.createElement('a');
      // element.setAttribute('href', 'data:text/yaml;charset=utf-8,' + encodeURIComponent(this.parsedRecipeString()!));
      element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(this.parsedRecipeString()!));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      alert('JSON file downloaded!');

    }

  async uploadRecipe() {
    const recipe = this.parsedRecipe();
    if (!recipe) return;

    if (!this.auth.currentUser) {
      alert('You must be logged in to upload a recipe.');
      return;
    }

    const user = await this.auth.currentUser;
    if (!user || !user.uid) {
      alert('User not authenticated.');
      return;
    }

    const userId = user.uid;
    const recipeName = recipe.recipe.toLowerCase()
      .replace(/\s+/g, '-') // Sanitize recipe name for document ID
      .replace(/[&]/g, ''); // Sanitize recipe name for document ID

    try {
      const cookbookRef = this.firestore.collection('cookbooks').doc(userId).collection('_cookbooks').doc('default-cookbook')
      const cookbookDoc = cookbookRef.get()
      cookbookDoc.subscribe(async (val: any) => {
        if (!val.exists || !val.data()) {
          const recipeStarter = {
            recipes: {
              recipeName
            },
            collections: {
              "All Items": {
                recipes: [{
                  key: recipeName,
                  label: recipe.recipe
                }]
              }
            }
          }
          await cookbookRef.set(recipeStarter)
        } else {
          const cookbook = val.data()
          cookbook.recipes[recipeName] = recipeName
          cookbook.collections['All Items'].recipes.push({
            key: recipeName,
            label: recipe.recipe
          })
          // Update our cookbook
          await cookbookRef.update(cookbook)
        }
      })

      const docRef = await this.firestore.collection('cookbooks').doc(userId).collection('default-cookbook').doc(recipeName).set({
        text: JSON.stringify(recipe, null, 2), // Store the recipe JSON as a string
        timestamp: Date.now()
      });
      alert('Recipe uploaded successfully!');
      this.link.set(`${window.location.origin}/f/${userId}/default-cookbook/${recipeName}`)
      return `/f/${userId}/default-cookbook/${recipeName}`
    } catch (error) {
      console.error('Error uploading recipe:', error);
      alert('Failed to upload recipe.');
    }
    return;
  }

    shareRecipe() {
        const recipe = this.parsedRecipe();
        if (!recipe) return;
        
        try {
            const jsonString = JSON.stringify(recipe);
            const base64Data = btoa(jsonString);
            const shareUrl = `${window.location.origin}${window.location.pathname}?recipe=${encodeURIComponent(base64Data)}`;
            
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert('Share URL copied to clipboard!');
            }, () => {
                alert('Could not copy URL.');
            });
        } catch(error) {
            alert('Error creating share link');
        }
    }

  async load(rdata: any, author: string, recipeName: string, file: string) {
    this.file = 'null'
    this.stars = -1
    this.data = rdata

    this.recipeId = 'null'
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
      console.log(step)
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
    console.log(this.parsedRecipe(), this.data)
    const steps = this.data.steps ?? [];
    console.log(this.data.steps)

    if (this.data.sections) {
      this.data.sections.forEach((section: { steps: any; }) => {
        steps.push(...section.steps);
      });
    }

    return steps;
  }

  ngOnInit() {

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
    return Math.round((celsius * 9 / 5) + 32)
  }
}
