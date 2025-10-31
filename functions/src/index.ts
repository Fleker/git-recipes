/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import { github } from "./github";
import SearchManager from './search'
import express from "express";
import { Recipe, Cookbook } from "./recipes";
const yaml = require('js-yaml');
const cors = require('cors');
import * as admin from 'firebase-admin'

// admin.initializeApp({
//     credential: admin.credential.applicationDefault(),
//     databaseURL: 'https://dishout-recipes.firebaseio.com'
// })

const db = admin.firestore();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

const searchEng = new SearchManager()

function preprocessRecipeYaml(filename: string, data: string): Recipe {
  console.log(filename)
  if (filename.endsWith('yaml')) {
    console.log('Convert from YAML')
    return yaml.load(data) as Recipe
  }
  return JSON.parse(data) as Recipe
}

function preprocessCookbookYaml(data: string): Cookbook {
    return yaml.load(data) as Cookbook
}

app.get('/g/:username/:repo', async (request: express.Request, response: express.Response) => {
    const {username, repo} = request.params
    const stars = await github.getStars(username, repo)
    try {
        const recipeFetch = await fetch(github.getDefaultRecipeUrl(username, repo), {})
        const recipeData = await recipeFetch.json()
        await searchEng.storeResult(`${username}/${repo}`, recipeData)
        return response.status(200).json({
            stars,
            recipeData,
            fileLocation: '.recipe.json'
        })
    } catch(e) {
        console.warn(`Could not find default recipe file`, e)
        // Try to render the cookbook
        try {
            const cookbookFetch = await fetch(`https://raw.githubusercontent.com/${username}/${repo}/master/.recipes.json`)
            const cookbookData = await cookbookFetch.json()
            return response.status(200).json({
                stars,
                cookbookData,
            })
        } catch (e) {
            console.error('Could not find cookbook', e)

            try {
                const cookbookFetch = await fetch(`https://raw.githubusercontent.com/${username}/${repo}/master/.recipes.yaml`)
                const cookbookData = await cookbookFetch.text()
                const cookbookJson = preprocessCookbookYaml(cookbookData)
                return response.status(200).json({
                    stars,
                    cookbookJson,
                })
            } catch (e) {
                console.error('Could not find cookbook either way', e)
                response.status(404).send(`Cannot find. Error: ${e}`)
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
        console.log('Fetched', recipe, 'as', fileLocation)
        const recipeJson = preprocessRecipeYaml(fileLocation, recipeData)
        await searchEng.storeResult(`${username}/${repo}/${recipe}`, recipeJson)
        return response.status(200).json({
            stars,
            recipeJson,
            fileLocation,
        })
    } catch (e) {
        console.error(e)
        response.status(404).send(`Cannot find. Error: ${e}`)
        return
    }
});

// For Firestore-based API calls, we fetch the text literally from Firestore
// https://us-central1-git-recipes.cloudfunctions.net/api/f/kZP1PYAbhhT2d5nwMAD8ozNJtxP2/default-cookbook/
app.get('/f/:profile/:repo', async (request: express.Request, response: express.Response) => {
    const {profile, repo} = request.params
    // Default is the _cookbook collection
    const doc = await db.collection('cookbooks').doc(profile).collection('_cookbooks').doc(repo).get()
    if (!doc.exists) {
        return response.status(404).send('Cookbook not found')
    }
    const cookbookData = doc.data()
    return response.status(200).json({
        cookbookData,
    })
});

// https://us-central1-git-recipes.cloudfunctions.net/api/f/kZP1PYAbhhT2d5nwMAD8ozNJtxP2/default-cookbook/honey-teriaki
app.get('/f/:profile/:repo/:recipe', async (request: express.Request, response: express.Response) => {
    const {profile, repo, recipe} = request.params
    const doc = await db.collection('cookbooks').doc(profile).collection(repo).doc(recipe).get()
    if (!doc.exists) {
        return response.status(404).send('Recipe not found')
    }
    const recipeJson = JSON.parse(doc.data()?.text)
    return response.status(200).json({
      recipeJson
    })
});


app.get('/search/:tag/json', async (request: express.Request, response: express.Response) => {
    const {tag} = request.params
    const records = await searchEng.getTopResults(tag.toLowerCase())
    response.status(200).json({
        tag,
        records,
    })
})

app.get("/hello", (req: express.Request, res: express.Response) => {
  logger.info("Hello path accessed!");
  res.send("Hello from Firebase!");
});

app.get("/users/:userId", (req: express.Request, res: express.Response) => {
  const userId = req.params.userId;
  logger.info(`User path accessed for userId: ${userId}`);
  res.send(`User ID: ${userId}`);
});

app.post("/data", (req: express.Request, res: express.Response) => {
  logger.info("Data path accessed with POST request!");
  res.status(200).send("Data received!");
});

export const api = onRequest(app);

