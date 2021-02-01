import express from 'express'
import bodyParser from 'body-parser'
import fetch from 'node-fetch'
import fs from 'fs'
import * as Sample from './samples'
import {github} from './github'
import { Recipe, Cookbook } from './recipes';
const yaml = require('js-yaml');

const app = express();
app.set('port', (process.env.PORT || 5002));

app.use(express.static('public'));
app.use('public', express.static('public'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

// views is directory for all template files
console.log(`${__dirname}/public`)
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Index
app.get('/', (request: express.Request, response: express.Response) => {
    response.render('pages/index');
    return;
});

app.get('/sample/potato-candy', (request: express.Request, response: express.Response) => {
    response.render('pages/recipe', {
        recipeId: `g/sample/project`,
        data: JSON.stringify(Sample.sampleRecipe),
        stars: 15
    });
    return;
})

app.get('/sample/sweet-crepe', (request: express.Request, response: express.Response) => {
    const data = yaml.load(fs.readFileSync('./public/sample-crepe.yaml', {encoding: 'utf-8'}))
    response.render('pages/recipe', {
        recipeId: `g/sample/project`,
        data: JSON.stringify(data),
        stars: 15
    });
    return;
})

app.get('/sample/cookbook', async (request: express.Request, response: express.Response) => {
    response.render('pages/cookbook', {
        recipeId: `g/sample/project`,
        data: JSON.stringify(Sample.sampleCookbook),
        stars: 15
    });
    return;
})

function renderRecipe(req: express.Request, res: express.Response, stars: number, recipe: Recipe) {
  res.render('pages/recipe', {
      recipeId: `g/${req.params.username}/${req.params.repo}`,
      data: JSON.stringify(recipe),
      stars
  });
}

function renderCookbook(req: express.Request, res: express.Response, stars: number, cookbook: Cookbook) {
  res.render('pages/cookbook', {
      recipeId: `g/${req.params.username}/${req.params.repo}`,
      data: JSON.stringify(cookbook),
      stars
  });
}

function preprocessRecipeYaml(filename: string, data: Recipe) {
  if (filename.endsWith('yaml')) {
    return yaml.load(data)
  }
  return data
}

// Add new resource
app.get('/g/:username/:repo', async (request: express.Request, response: express.Response) => {
    const {username, repo} = request.params
    const stars = await github.getStars(username, repo)
    try {
        const recipeFetch = await fetch(github.getDefaultRecipeUrl(username, repo), {})
        const recipeData = await recipeFetch.json()
        renderRecipe(request, response, stars, recipeData)
    } catch(e) {
        console.warn(`Could not find default recipe file`, e)
        // Try to render the cookbook
        try {
            const cookbookFetch = await fetch(`https://raw.githubusercontent.com/${username}/${repo}/master/.recipes.json`)
            const cookbookData = await cookbookFetch.json()
            renderCookbook(request, response, stars, cookbookData)
        } catch (e) {
            console.error('Could not find cookbook', e)
        }
    }
    return;
});

// Add new resource
app.get('/g/:username/:repo/:recipe', async (request: express.Request, response: express.Response) => {
    const {username, repo, recipe} = request.params
    const stars = await github.getStars(username, repo)
    try {
        const cookbookFetch = await fetch(github.getCookbookUrl(username, repo))
        const cookbookData = await cookbookFetch.json()
        const fileLocation = cookbookData.recipes[recipe]
        const recipeFetch = await fetch(github.getUrl(username, repo, fileLocation))
        const recipeData = await recipeFetch.json()
        const recipeJson = preprocessRecipeYaml(fileLocation, recipeData)
        renderRecipe(request, response, stars, recipeJson)
    } catch (e) {
        console.error(e)
        response.status(404).send(`Cannot find. Error: ${e}`)
        return
    }
    return;
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
