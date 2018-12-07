const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Index
app.get('/', (request, response) => {
    response.render('pages/index');
    return;
});

app.get('/sample/potato-candy', (request, response) => {
    const sampleData = {
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
            "cookTime": {
                "amount": 0
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

    response.render('pages/recipe', {
        recipeId: `g/sample/project`,
        data: JSON.stringify(sampleData),
        stars: 15
    });
    return;
})

app.get('/sample/cookbook', async (request, response) => {
    const sampleData = {
        "recipes": {
            "potato-candy": "desserts/potatos/candy.json",
            "caramel-apple": "caramel-apple.json"
        },
        "collections": {
            "Desserts": {
                "recipes": [
                    "potato-candy",
                    "caramel-apple"
                ]
            }
        }
    }

    response.render('pages/cookbook', {
        recipeId: `g/sample/project`,
        data: JSON.stringify(sampleData),
        stars: 14
    });
    return;
})

// Add new resource
app.get('/g/:username/:repo', async (request, response) => {
    const {username, repo} = request.params
    try {
        const recipeFetch = await fetch(`https://raw.githubusercontent.com/${username}/${repo}/master/.recipe.json`)
        const recipeData = await recipeFetch.json()

        const starsFetch = await fetch(`https://api.github.com/repos/${username}/${repo}`)
        const starsData = await starsFetch.json()

        response.render('pages/recipe', {
            recipeId: `g/${request.params.username}/${request.params.repo}`,
            data: JSON.stringify(recipeData),
            stars: starsData.stargazers_count
        });
    } catch(e) {
        // Try to render the cookbook
        const cookbookFetch = await fetch(`https://raw.githubusercontent.com/${username}/${repo}/master/.recipes.json`)
        const cookbookData = await cookbookFetch.json()

        const starsFetch = await fetch(`https://api.github.com/repos/${username}/${repo}`)
        const starsData = await starsFetch.json()

        response.render('pages/cookbook', {
            recipeId: `g/${request.params.username}/${request.params.repo}`,
            data: JSON.stringify(cookbookData),
            stars: starsData.stargazers_count
        });
    }
    return;
});


// Add new resource
app.get('/g/:username/:repo/:recipe', async (request, response) => {
    const {username, repo, recipe} = request.params
    const recipeNavFetch = await fetch(`https://raw.githubusercontent.com/${username}/${repo}/master/${recipe}.recipes.json`)
    const recipeNavData = await recipeNavFetch.json()

    const fileLocation = recipeNavData[recipe]

    const recipeFetch = await fetch(`https://raw.githubusercontent.com/${username}/${repo}/master/${fileLocation}`)
    const recipeData = await recipeFetch.json()

    const starsFetch = await fetch(`https://api.github.com/repos/${username}/${repo}`)
    const starsData = await starsFetch.json()

    response.render('pages/recipe', {
        recipeId: `g/${request.params.username}/${request.params.repo}`,
        data: JSON.stringify(recipeData),
        stars: starsData.stargazers_count
    });
    return;
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});