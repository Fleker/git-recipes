import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesListComponent } from './favorites-list.component';

describe('FavoritesListComponent', () => {
  let component: FavoritesListComponent;
  let fixture: ComponentFixture<FavoritesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoritesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoritesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
