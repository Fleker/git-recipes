import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('splashscreen') splashscreen?: ElementRef<HTMLElement>
  title = 'git-recipes-2';

  ngAfterViewInit() {
    setTimeout(() => {
      this.splashscreen?.nativeElement?.classList.add('hide')
      setTimeout(() => {
        this.splashscreen?.nativeElement?.classList.add('gone')
      })
    }, 500)
  }
}
