const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const Sample = require('./samples')

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
    response.render('pages/recipe', {
        recipeId: `g/sample/project`,
        data: JSON.stringify(Sample.sampleRecipe),
        stars: 15
    });
    return;
})

app.get('/sample/cookbook', async (request, response) => {
    response.render('pages/cookbook', {
        recipeId: `g/sample/project`,
        data: JSON.stringify(Sample.sampleCookbook),
        stars: 15
    });
    return;
})

const getStars = async (username, repo) => {
    const starsFetch = await fetch(`https://api.github.com/repos/${username}/${repo}`)
    const starsData = await starsFetch.json()
    return starsData.stargazers_count
}

// Add new resource
app.get('/g/:username/:repo', async (request, response) => {
    const {username, repo} = request.params
    const stars = await getStars(username, repo)
    try {
        const recipeFetch = await fetch(`https://raw.githubusercontent.com/${username}/${repo}/master/.recipe.json`)
        const recipeData = await recipeFetch.json()

        response.render('pages/recipe', {
            recipeId: `g/${request.params.username}/${request.params.repo}`,
            data: JSON.stringify(recipeData),
            stars
        });
    } catch(e) {
        // Try to render the cookbook
        const cookbookFetch = await fetch(`https://raw.githubusercontent.com/${username}/${repo}/master/.recipes.json`)
        const cookbookData = await cookbookFetch.json()

        response.render('pages/cookbook', {
            recipeId: `g/${request.params.username}/${request.params.repo}`,
            data: JSON.stringify(cookbookData),
            stars
        });
    }
    return;
});

// Add new resource
app.get('/g/:username/:repo/:recipe', async (request, response) => {
    const {username, repo, recipe} = request.params
    let cookbookData, recipeData
    try {
        const cookbookFetch = await fetch(`https://raw.githubusercontent.com/${username}/${repo}/master/.recipes.json`)
        cookbookData = await cookbookFetch.json()
    } catch (e) {
        console.error(e)
        response.status(404).send(`Cannot find. Error: ${e}`)
        return
    }
    const fileLocation = cookbookData.recipes[recipe]

    try {
        const recipeFetch = await fetch(`https://raw.githubusercontent.com/${username}/${repo}/master/${fileLocation}`)
        recipeData = await recipeFetch.json()
    } catch (e) {
        console.error(e)
        response.status(404).send(`Cannot find. Error: ${e}`)
        return
    }

    response.render('pages/recipe', {
        recipeId: `g/${request.params.username}/${request.params.repo}`,
        data: JSON.stringify(recipeData),
        stars: await getStars(username, repo)
    });
    return;
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});