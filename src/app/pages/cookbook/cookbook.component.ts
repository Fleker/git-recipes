import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cookbook',
  templateUrl: './cookbook.component.html',
  styleUrls: ['./cookbook.component.css']
})
export class CookbookComponent implements OnInit {
  @Input('stars') stars: number = -1
  @Input('recipeId') recipeId?: string
  @Input('recipeData') recipeData?: any
  collections?: any[]
  allRecipes?: any[]

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      console.log(params)
      const author = params.get('profile')!
      const recipeName = params.get('repo')!
      this.recipeId = window.location.pathname
      this.load(author, recipeName)
    })
  }

  async load(author: string, recipeName: string) {
    const res = await fetch(`https://git-recipes.uc.r.appspot.com/api/g/${author}/${recipeName}/`)
    const rdata = await res.json()
    this.recipeData = rdata.cookbookData
    this.stars = rdata.stars
    this.collections = Object.entries(this.recipeData!.collections)
    this.allRecipes = Object.entries(this.recipeData!.recipes)
    console.log(this.collections)
  }
}
