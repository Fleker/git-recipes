import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeStepComponent } from './recipe-step.component';

describe('RecipeStepComponent', () => {
  let component: RecipeStepComponent;
  let fixture: ComponentFixture<RecipeStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeStepComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
