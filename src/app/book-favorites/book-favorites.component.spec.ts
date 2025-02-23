import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookFavoritesComponent } from './book-favorites.component';

describe('BookFavoritesComponent', () => {
  let component: BookFavoritesComponent;
  let fixture: ComponentFixture<BookFavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookFavoritesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
