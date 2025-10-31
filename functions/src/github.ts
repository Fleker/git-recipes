import {Host} from './host'

export const github: Host = {
  getStars: async (username: string, repo: string) => {
    const starsFetch = await fetch(`https://api.github.com/repos/${username}/${repo}`, {})
    const starsData = await starsFetch.json()
    return starsData.stargazers_count
  },
  getCookbookUrl: (username: string, repo: string) => {
    return `https://raw.githubusercontent.com/${username}/${repo}/master/.recipes.json`
  },
  getDefaultRecipeUrl: (username: string, repo: string) => {
    return `https://raw.githubusercontent.com/${username}/${repo}/master/.recipe.json`
  },
  getUrl: (username: string, repo: string, recipe: string) => {
    return `https://raw.githubusercontent.com/${username}/${repo}/master/${recipe}`
  }
}
