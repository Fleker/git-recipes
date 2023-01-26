import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StyledCardComponent } from './styled-card.component';

describe('StyledCardComponent', () => {
  let component: StyledCardComponent;
  let fixture: ComponentFixture<StyledCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StyledCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StyledCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
