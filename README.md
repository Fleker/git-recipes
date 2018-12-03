# Recipes.tech

This is a service which allows users to share recipes, hosted through GitHub.

Using git for recipes makes it easy for individuals to modify their recipes while
maintaining version history. Plus, it's easy for others to fork the recipe, make adjustments,
and then file a pull request to update it.

## Hosting
Each recipe exists as a JSON file which is placed in a GitHub repository called `.recipe.json`. The specification is below.

```
{
    "author": "Nick Felker",
    "recipe": "Potato Candy",
    "spec": "v0.1.0",
    "tags": "potato, candy",
    "servings": 24,
    "prelude": {
        "description": "Potato candy is...",
        "images": [{
            "src": "http://example.com/potato1.png",
            "description": "Potato"
        }],
        "videos": [{
            "youtube": "youtubeid"
        }]
    },
    "steps": [{
        "description": "Cut the potato",
        "ingredients": [{
            "item": "Russet potato",
            "amount": 1,
            "unit": ""
        }],
        "equipment": [{
            "item": "Potato slicer"
        }],
        "prepTime": {
            "amount": 5,
            "unit": "minutes"
        },
        "cookTime": {
            "amount": 0,
            "unit": ""
        },
        "images": [{
            "src": "http://example.com/potato2.png",
            "description": "Sliced potato"
        }],
        "videos": [{
            "youtube": "youtubeid"
        }]
    }, {
        "description": "Mix in powdered sugar until mxied well",
        "ingredients": [{
            "item": "Powdered sugar",
            "min": 4,
            "max": 6,
            "unit": "cups"
        }],
        "equipment": [{
            "item": "Mixing bowl"
        }, {
            "item": "Wooden spoon"
        }],
        "prepTime": {
            "amount": 3,
            "unit": "minutes"
        },
        "cookTime": {
            "amount": 0,
            "unit": ""
        },
        "images": [{
            "src": "http://example.com/potato3.png",
            "description": "Mixed potato"
        }],
        "videos": [{
            "youtube": "youtubeid"
        }]
    }]
}
```

* author - Display name for the recipe author
* recipe - The name of the recipe
* spec - The JSON specification version. This can help preserve backwards compatibility if it changes.
* tags - Comma-separated tags that may aid for searches
* servings - The number of servings the recipe will make
* prelude - The information that may appear at the top of the recipe
    * description - A description of what the recipe may be, such as flavor or history
    * images - An array of photographs or images with a `src` and a `description` of that image
    * videos - An array of videos. Only YouTube is supported at the moment, with `youtube` and the YouTube ID
* steps - The series of steps to make this recipe. Information from each step will be compiled at the top to present the list of ingredients, equipment, and other metadata.
    * description - A description of what the recipe will do
    * ingredients - An array of ingredients. Only populate this array if you are introducing a new ingredient
        * item - The name of the ingredient
        * amount - The exact amount of this ingredient
        * min/max - Alternatively, you can specify a range of a particular ingredient
        * units - The units of this ingredient
    * equipment - An array of equipment for a given task. This should be populated in every step if applicable
        * item - The name of the equipment
    * prepTime - The time it takes for this step
        * amount - The exact amount of time
        * units - The time unit
    * cookTime - The time it takes for cooking in a given step
        * amount - The exact amount of time
        * units - The time unit
    * images/videos - Like above, you can add images and videos in each step

## Why
I tried using a few different recipe websites, but I had a few issues with using them:

* The websites were cluttered with ads and was slow. I wanted a clean navigation and design.
* There was a recipe that I followed mostly, but with one change. I wanted a way to literally fork the recipe and add a small patch.
* The recipes often list what ingredients you need, but not which equipment. When reading a recipe ahead of time, I realized that I needed a baking pan.

The goal of this website is to remedy those issues.

## Setup
Here's how you can set up the project for yourself

* `yarn`
* `yarn build` - Will build
* `yarn serve` - Will build and serve locally