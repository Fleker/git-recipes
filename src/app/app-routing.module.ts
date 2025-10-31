import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CookbookComponent } from './pages/cookbook/cookbook.component';
import { HomeComponent } from './pages/home/home.component';
import { RecipeComponent } from './pages/recipe/recipe.component';
import { ShareComponent } from './pages/share/share.component';

const routes: Routes = [{
  path: ':db/:profile/:repo',
  component: CookbookComponent
}, {
  path: ':db/:profile/:repo/:file',
  component: RecipeComponent
}, {
  path: 'share',
  component: ShareComponent
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
