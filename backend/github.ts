import fetch from 'node-fetch'

export const github: Host = {
  getStars: async (username, repo) => {
    const starsFetch = await fetch(`https://api.github.com/repos/${username}/${repo}`, {})
    const starsData = await starsFetch.json()
    return starsData.stargazers_count
  },
  getCookbookUrl: (username, repo) => {
    return `https://raw.githubusercontent.com/${username}/${repo}/master/.recipes.json`
  },
  getDefaultRecipeUrl: (username, repo) => {
    return `https://raw.githubusercontent.com/${username}/${repo}/master/.recipe.json`
  },
  getUrl: (username, repo, recipe) => {
    return `https://raw.githubusercontent.com/${username}/${repo}/master/${recipe}`
  }
}
