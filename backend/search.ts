import * as admin from 'firebase-admin';
import { Recipe } from './recipes';
// var serviceAccount = require("./key.json");

admin.initializeApp({
  // credential: admin.credential.cert(serviceAccount) // Use ADC
});

class SearchManager {
  db: FirebaseFirestore.Firestore

  constructor() {
    this.db = admin.firestore()
  }

  async getTopResults(tag: string): Promise<string[][]> {
    const tagDoc = await this.db.collection('search').doc(tag).get()
    const records = tagDoc.data() as Record<string, string>
    const sanitizedRecords = Object.entries(records).map(([key, val]) => {
      return [key.replace(/[|]/g, '/'), val]
    })
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
