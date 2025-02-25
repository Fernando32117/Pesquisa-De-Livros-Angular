import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BookFavoritesComponent } from './book-favorites.component';
import { BookStorageService } from '../book-storage.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('BookFavoritesComponent', () => {
  let component: BookFavoritesComponent;
  let fixture: ComponentFixture<BookFavoritesComponent>;
  let bookStorageService: BookStorageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookFavoritesComponent ],
      imports: [ FormsModule, BrowserAnimationsModule ],
      providers: [ BookStorageService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookFavoritesComponent);
    component = fixture.componentInstance;
    bookStorageService = TestBed.inject(BookStorageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display favorite books', () => {
    const book = { id: '1', volumeInfo: { title: 'Test Book' }, notes: 'Some notes', rating: 5, tags: ['tag1'] };
    bookStorageService.addFavorite(book);
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.filteredFavorites).toContain(jasmine.objectContaining({ id: '1' }));
  });

  it('should filter books by tag or title', () => {
    const book1 = { id: '1', volumeInfo: { title: 'Test Book 1' }, notes: '', rating: 0, tags: ['tag1'] };
    const book2 = { id: '2', volumeInfo: { title: 'Another Book' }, notes: '', rating: 0, tags: ['tag2'] };
    bookStorageService.addFavorite(book1);
    bookStorageService.addFavorite(book2);
    component.ngOnInit();
    fixture.detectChanges();

    component.filter = 'Test';
    component.applyFilter();
    fixture.detectChanges();
    expect(component.filteredFavorites).toContain(jasmine.objectContaining({ id: '1' }));
    expect(component.filteredFavorites).not.toContain(jasmine.objectContaining({ id: '2' }));

    component.filter = 'tag2';
    component.applyFilter();
    fixture.detectChanges();
    expect(component.filteredFavorites).toContain(jasmine.objectContaining({ id: '2' }));
    expect(component.filteredFavorites).not.toContain(jasmine.objectContaining({ id: '1' }));
  });

  it('should open and close the modal', () => {
    const book = { id: '1', volumeInfo: { title: 'Test Book' }, notes: '', rating: 0, tags: ['tag1'] };
    component.openModal(book);
    expect(component.selectedBook).toEqual(book);
    component.closeModal();
    expect(component.selectedBook).toBeNull();
  });

  it('should remove a book from favorites', () => {
    const book = { id: '1', volumeInfo: { title: 'Test Book' } };
    bookStorageService.addFavorite(book);
    component.ngOnInit();
    fixture.detectChanges();
    component.removeFavorite(book.id);
    fixture.detectChanges();
    expect(component.filteredFavorites).not.toContain(jasmine.objectContaining({ id: '1' }));
  });
});
