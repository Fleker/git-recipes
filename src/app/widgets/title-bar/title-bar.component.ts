import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs';

const unhearted = 'favorite_border';
const hearted = 'favorite';

@Component({
  selector: 'title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.css']
})
export class TitleBarComponent implements OnInit {
  @Input('stars') stars: number = -1
  @Input('label') label: string = ''
  @Input('recipe-id') recipeId?: string
  hearted?: string
  author?: string
  recipeName?: string
  forkLink?: string

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      console.log(params)
      this.author = params.get('profile')!
      this.recipeName = params.get('repo')!
      this.loadTitlebar()
    })
  }

  loadTitlebar() {
    const recipeElements = this.recipeId?.split('/');
    if (!recipeElements) return

    if (recipeElements[0] === 'g') {
      // GitHub
      this.author = recipeElements[1];
      this.recipeName = recipeElements[2];
      this.forkLink = `https://github.com/${this.author}/${this.recipeName}`;
    }

    this.hearted = this.hasHearted() > -1 ? hearted : unhearted;
    const url = window.location.pathname;
    console.log('Got', url);
  }

  hasHearted() {
    const url = window.location.pathname;

    if (localStorage.getItem('favorites')) {
      const localFavorites = JSON.parse(localStorage.getItem('favorites') ?? '[]');
      return localFavorites.findIndex((v: {url: string}) => v.url === url);
    }

    return -1;
  }

  heartToggle() {
    const url = window.location.pathname;

    const label = this.label ? this.label : this.recipeId;
    console.log('Heart this item!', url, label);

    if (localStorage.getItem('favorites')) {
      const localFavorites = JSON.parse(localStorage.getItem('favorites') ?? '[]')
      const recipeIndex = this.hasHearted();

      if (recipeIndex > -1) {
        // We already have it saved.
        // Toggle.
        localFavorites.splice(recipeIndex, 1);
        this.hearted = unhearted;
      } else {
        localFavorites.push({
          url,
          label
        });
        this.hearted = hearted;
      }

      localStorage.setItem('favorites', JSON.stringify(localFavorites));
    } else {
      localStorage.setItem('favorites', JSON.stringify([{
        url,
        label
      }]));
    }

    console.info('Updated favorites list!');
  }
}
