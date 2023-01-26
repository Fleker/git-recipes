import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookbookComponent } from './cookbook.component';

describe('CookbookComponent', () => {
  let component: CookbookComponent;
  let fixture: ComponentFixture<CookbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CookbookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
