import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'favorites-list',
  templateUrl: './favorites-list.component.html',
  styleUrls: ['./favorites-list.component.css']
})
export class FavoritesListComponent implements OnInit {
  favorites?: {
    url: string
    label: string
  }[]

  ngOnInit() {
    console.debug('Connected to favorites list')

    if (localStorage.getItem('favorites')) {
      console.log('Load favorites item')
      this.favorites = JSON.parse(localStorage.getItem('favorites') ?? '[]')
      console.log(this.favorites)
    }
  }
}
