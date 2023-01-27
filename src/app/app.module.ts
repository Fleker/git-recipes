import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StyledCardComponent } from './widgets/styled-card/styled-card.component';
import { FavoritesListComponent } from './widgets/favorites-list/favorites-list.component';
import { HeaderComponent } from './widgets/header/header.component';
import { CookbookComponent } from './pages/cookbook/cookbook.component';
import { RecipeComponent } from './pages/recipe/recipe.component';
import { HomeComponent } from './pages/home/home.component';
import { TitleBarComponent } from './widgets/title-bar/title-bar.component';
import { CarouselImageComponent } from './widgets/carousel-image/carousel-image.component';
import { PlayerYoutubeComponent } from './widgets/player-youtube/player-youtube.component';
import { RecipeUnitComponent } from './widgets/recipe-unit/recipe-unit.component';
import { RecipeStepComponent } from './widgets/recipe-step/recipe-step.component';

@NgModule({
  declarations: [
    AppComponent,
    StyledCardComponent,
    FavoritesListComponent,
    HeaderComponent,
    CookbookComponent,
    RecipeComponent,
    HomeComponent,
    TitleBarComponent,
    CarouselImageComponent,
    PlayerYoutubeComponent,
    RecipeUnitComponent,
    RecipeStepComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
