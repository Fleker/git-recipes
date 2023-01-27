import { Component, Input } from '@angular/core';

@Component({
  selector: 'recipe-step',
  templateUrl: './recipe-step.component.html',
  styleUrls: ['./recipe-step.component.css']
})
export class RecipeStepComponent {
  @Input('steps') steps?: any[]
}
