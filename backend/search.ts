import * as admin from 'firebase-admin';
import { Recipe } from './recipes';
try {
  const serviceAccount = require("./key.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount) // Use ADC
  });
  console.info('Loaded service account key -- likely a local environment')
} catch (e) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault() // Use ADC
  });
  console.info('Loaded default credentials -- like in prod')
}

class SearchManager {
  db: FirebaseFirestore.Firestore

  constructor() {
    this.db = admin.firestore()
  }

  async getTopResults(tag: string): Promise<string[][]> {
    const tagDoc = await this.db.collection('search').doc(tag).get()
    if (!tagDoc.exists) {
      console.debug(`No tag ${tag}`)
      return []
    }
    const records = tagDoc.data() as Record<string, string>
    if (!records) {
      console.debug(`No records for ${tag}`)
      return []
    }
    const sanitizedRecords = Object.entries(records).map(([key, val]) => {
      return [key.replace(/[|]/g, '/'), val]
    }).slice(0, 20)
    // For now grab default sort
    return sanitizedRecords
  }

  async storeResult(path: string, recipe: Recipe) {
    const tags = recipe.tags.split(',').map(tag => tag.trim())
    const parsedPath = path.replace(/\//g, '|')
    for (const t of tags) {
      const tagDoc = await this.db.collection('search').doc(t).get()
      if (tagDoc.exists) {
        await tagDoc.ref.update({
          [parsedPath]: recipe.recipe
        })
      } else {
        await tagDoc.ref.set({
          [parsedPath]: recipe.recipe
        })
      }
    }
  }
}

export default SearchManager
