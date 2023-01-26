import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cookbook',
  templateUrl: './cookbook.component.html',
  styleUrls: ['./cookbook.component.css']
})
export class CookbookComponent {
  @Input('stars') stars: number = -1
  @Input('recipeId') recipeId?: string
  @Input('recipeData') recipeData?: string
  collections?: any[]
  allRecipes?: any[]
}
