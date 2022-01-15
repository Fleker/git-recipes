import express from 'express'
import bodyParser from 'body-parser'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import * as Sample from './samples'
import {github} from './github'
import { Recipe, Cookbook } from './recipes';
import SearchManager from './search'
const yaml = require('js-yaml');

const app = express();
const searchEng = new SearchManager()
app.set('port', (process.env.PORT || 5003));

app.use(express.static('public'));
app.use('public', express.static('public'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

// views is directory for all template files

const getDirectories = (source: string) =>
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

console.log(`${__dirname}/public`)
console.log(getDirectories(__dirname))
console.log(getDirectories(`${__dirname}/public`))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Index
app.get('/', (request: express.Request, response: express.Response) => {
    console.log('Load index')
    response.render('pages/index');
    return;
});

app.get('/docs', (request: express.Request, response: express.Response) => {
    response.render('pages/docs');
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

app.get('/sample/sections-optional', (request: express.Request, response: express.Response) => {
    const data = yaml.load(fs.readFileSync('./public/sample-sections-optional.yaml',
        {encoding: 'utf-8'}))
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

function preprocessRecipeYaml(filename: string, data: string): Recipe {
  if (filename.endsWith('yaml')) {
    return yaml.load(data) as Recipe
  }
  return JSON.parse(data) as Recipe
}

function preprocessCookbookYaml(data: string): Cookbook {
    return yaml.load(data) as Cookbook
}

// Add new resource
app.get('/g/:username/:repo', async (request: express.Request, response: express.Response) => {
    const {username, repo} = request.params
    const stars = await github.getStars(username, repo)
    try {
        const recipeFetch = await fetch(github.getDefaultRecipeUrl(username, repo), {})
        const recipeData = await recipeFetch.json()
        await searchEng.storeResult(`${username}/${repo}`, recipeData)
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

            try {
                const cookbookFetch = await fetch(`https://raw.githubusercontent.com/${username}/${repo}/master/.recipes.yaml`)
                const cookbookData = await cookbookFetch.text()
                const cookbookJson = preprocessCookbookYaml(cookbookData)
                renderCookbook(request, response, stars, cookbookJson)
            } catch (e) {
                console.error('Could not find cookbook either way', e)
            }
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
        const recipeData = await recipeFetch.text()
        const recipeJson = preprocessRecipeYaml(fileLocation, recipeData)
        await searchEng.storeResult(`${username}/${repo}/${recipe}`, recipeJson)
        renderRecipe(request, response, stars, recipeJson)
    } catch (e) {
        console.error(e)
        response.status(404).send(`Cannot find. Error: ${e}`)
        return
    }
    return;
});

app.get('/search/:tag/json', async (request: express.Request, response: express.Response) => {
    const {tag} = request.params
    const records = await searchEng.getTopResults(tag.toLowerCase())
    response.status(200).json({
        tag,
        records,
    })
})

app.get('/search/:tag', async (request: express.Request, response: express.Response) => {
    const {tag} = request.params
    const records = await searchEng.getTopResults(tag.toLowerCase())
    response.render('pages/search', {
        tag,
        records,
    });
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
