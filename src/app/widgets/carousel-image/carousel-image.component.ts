import { Component, Input } from '@angular/core';

@Component({
  selector: 'carousel-image',
  templateUrl: './carousel-image.component.html',
  styleUrls: ['./carousel-image.component.css']
})
export class CarouselImageComponent {
  @Input('src') src?: string
  @Input('description') description?: string
}
