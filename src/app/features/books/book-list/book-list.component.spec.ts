import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { BookListComponent } from './book-list.component';
import { BookStorageService } from '../../../core/services/book-storage.service';
import { AuthService } from '../../../core/services/auth.service';
import { Book } from '../../../models/book.model';

describe('BookListComponent', () => {
  let component: BookListComponent;
  let fixture: ComponentFixture<BookListComponent>;
  let bookStorageService: BookStorageService;

  const createBook = (overrides: Partial<Book> = {}): Book => ({
    id: '1',
    title: 'Test Book',
    authors: ['Test Author'],
    notes: '',
    rating: 0,
    tags: [],
    ...overrides,
  });

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [BookListComponent, FormsModule],
      providers: [BookStorageService, AuthService, provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookListComponent);
    component = fixture.componentInstance;
    bookStorageService = TestBed.inject(BookStorageService);
    fixture.detectChanges();
  });

  it('deveria criar', () => {
    expect(component).toBeTruthy();
  });

  it('deve abrir o modal com o livro selecionado', () => {
    const book = createBook();
    component.openModal(book);

    expect(component.selectedBook).toEqual(
      jasmine.objectContaining({ id: book.id, title: book.title }),
    );
  });

  it('deveria fechar o modal', () => {
    component.openModal(createBook());
    component.closeModal();

    expect(component.selectedBook).toBeNull();
  });

  it('deve alternar um livro como favorito', () => {
    localStorage.setItem('token', 'fake-jwt-token');

    const book = createBook();
    component.toggleFavorite(book);
    expect(bookStorageService.isFavorite(book.id)).toBeTrue();

    component.toggleFavorite(book);
    expect(bookStorageService.isFavorite(book.id)).toBeFalse();
  });

  it('deveria salvar um livro como favorito', () => {
    localStorage.setItem('token', 'fake-jwt-token');

    const book = createBook({ tags: ['tag1', 'tag2'] });
    component.saveFavorite(book);

    expect(bookStorageService.getFavorites()).toContain(
      jasmine.objectContaining({ id: '1' }),
    );
  });
});
