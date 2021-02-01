interface Host {
  getStars: (username: string, repo: string) => Promise<number>
  getCookbookUrl: (username: string, repo: string) => string
  getDefaultRecipeUrl: (username: string, repo: string) => string
  getUrl: (username: string, repo: string, recipe: string) => string
}
