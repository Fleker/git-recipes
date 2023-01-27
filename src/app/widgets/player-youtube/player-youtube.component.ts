import { Component, Input } from '@angular/core';

@Component({
  selector: 'player-youtube',
  templateUrl: './player-youtube.component.html',
  styleUrls: ['./player-youtube.component.css']
})
export class PlayerYoutubeComponent {
  @Input('vid') vid?: string
}
