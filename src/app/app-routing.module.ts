import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CookbookComponent } from './pages/cookbook/cookbook.component';
import { HomeComponent } from './pages/home/home.component';
import { RecipeComponent } from './pages/recipe/recipe.component';

const routes: Routes = [{
  path: 'g/:profile/:repo',
  component: CookbookComponent
}, {
  path: 'g/:profile/:repo/:file',
  component: RecipeComponent
}, {
  path: '',
  component: HomeComponent,
  pathMatch: 'full',
}]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
