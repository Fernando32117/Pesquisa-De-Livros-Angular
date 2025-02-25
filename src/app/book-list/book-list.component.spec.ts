import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BookListComponent } from './book-list.component';
import { BookStorageService } from '../book-storage.service';

describe('BookListComponent', () => {
  let component: BookListComponent;
  let fixture: ComponentFixture<BookListComponent>;
  let bookStorageService: BookStorageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookListComponent ],
      imports: [ FormsModule ],
      providers: [ BookStorageService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookListComponent);
    component = fixture.componentInstance;
    bookStorageService = TestBed.inject(BookStorageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the modal with the selected book', () => {
    const book = { id: '1', volumeInfo: { title: 'Test Book' } };
    component.openModal(book);
    expect(component.selectedBook).toEqual(book);
  });

  it('should close the modal', () => {
    const book = { id: '1', volumeInfo: { title: 'Test Book' } };
    component.openModal(book);
    component.closeModal();
    expect(component.selectedBook).toBeNull();
  });

  it('should toggle a book as favorite', () => {
    const book = { id: '1', volumeInfo: { title: 'Test Book' } };
    component.toggleFavorite(book);
    expect(bookStorageService.isFavorite(book.id)).toBeTrue();
    component.toggleFavorite(book);
    expect(bookStorageService.isFavorite(book.id)).toBeFalse();
  });

  it('should save a book as favorite', () => {
    const book = { id: '1', volumeInfo: { title: 'Test Book', tags: 'tag1,tag2' } };
    component.saveFavorite(book);
    expect(bookStorageService.getFavorites()).toContain(jasmine.objectContaining({ id: '1' }));
  });
});
