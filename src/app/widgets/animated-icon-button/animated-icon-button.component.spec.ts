import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedIconButtonComponent } from './animated-icon-button.component';

describe('AnimatedIconButtonComponent', () => {
  let component: AnimatedIconButtonComponent;
  let fixture: ComponentFixture<AnimatedIconButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimatedIconButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnimatedIconButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
