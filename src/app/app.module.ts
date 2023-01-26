import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StyledCardComponent } from './widgets/styled-card/styled-card.component';
import { FavoritesListComponent } from './widgets/favorites-list/favorites-list.component';

@NgModule({
  declarations: [
    AppComponent,
    StyledCardComponent,
    FavoritesListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
