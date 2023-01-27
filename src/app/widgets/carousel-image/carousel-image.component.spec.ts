import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselImageComponent } from './carousel-image.component';

describe('CarouselImageComponent', () => {
  let component: CarouselImageComponent;
  let fixture: ComponentFixture<CarouselImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarouselImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
