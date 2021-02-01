import { Cookbook, Recipe } from "./recipes";

export const sampleRecipe: Recipe = {
    "author": "Nick Felker",
    "recipe": "Potato Candy",
    "spec": "v0.1.0",
    "tags": "potato, candy",
    "servings": 24,
    "prelude": {
        "description": "Potato candy is...",
        "images": [{
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Irish_potato_candy.JPG/800px-Irish_potato_candy.JPG",
            "description": "Potato"
        }],
        "videos": [{
            "youtube": "_DYjVyn_lpA"
        }]
    },
    "steps": [{
        "description": "Cut the potato",
        "ingredients": [{
            "item": "Russet potato",
            "amount": 1
        }],
        "equipment": [{
            "item": "Potato slicer"
        }],
        "prepTime": {
            "amount": 5,
            "unit": "minutes"
        },
        "images": [{
            "src": "https://c1.staticflickr.com/4/3383/3189599841_0e25065384_b.jpg",
            "description": "Sliced potato"
        }],
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
        "images": [{
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Pinni.JPG/450px-Pinni.JPG",
            "description": "This is called pinni"
        }],
    }, {
        "description": "Add more powdered sugar just because",
        "ingredients": [{
            "item": "Powdered sugar",
            "min": 1,
            "max": 3,
            "unit": "cup"
        }],
        "equipment": [{
            "item": "Mixing bowl"
        }],
        "prepTime": {
            "amount": 60,
            "unit": "seconds"
        }
    }]
}

export const sampleCookbook: Cookbook = {
    "recipes": {
        "potato-candy": "desserts/potatos/candy.json",
        "caramel-apple": "caramel-apple.json"
    },
    "collections": {
        "desserts": {
            "recipes": [{
                "key": "potato-candy",
                "label": "Potato Candy"
            }, {
                "key": "caramel-apple",
                "label": "Caramel Apple"
            }]
        }
    }
}