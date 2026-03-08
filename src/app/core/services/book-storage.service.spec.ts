import { TestBed } from '@angular/core/testing';
import { BookStorageService } from './book-storage.service';
import { Book } from '../../shared/models/book.model';

describe('BookStorageService', () => {
  let service: BookStorageService;

  const createBook = (overrides: Partial<Book> = {}): Book => ({
    id: '1',
    title: 'Test Book',
    authors: ['Test Author'],
    notes: '',
    rating: 0,
    tags: [],
    ...overrides,
  });

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a book to favorites', () => {
    const book = createBook();
    service.addFavorite(book);

    expect(service.getFavorites()).toContain(
      jasmine.objectContaining({ id: book.id, title: book.title })
    );
  });

  it('should remove a book from favorites', () => {
    const book = createBook();
    service.addFavorite(book);

    service.removeFavorite(book.id);

    expect(service.getFavorites()).not.toContain(
      jasmine.objectContaining({ id: book.id })
    );
  });

  it('should update a favorite book', () => {
    const book = createBook({ notes: '' });
    const updatedBook = createBook({ notes: 'Updated notes' });

    service.addFavorite(book);
    service.updateFavorite(updatedBook);

    expect(service.getFavorites().find((b) => b.id === book.id)?.notes).toBe(
      'Updated notes'
    );
  });

  it('should check if a book is a favorite', () => {
    const book = createBook();
    service.addFavorite(book);

    expect(service.isFavorite(book.id)).toBeTrue();

    service.removeFavorite(book.id);

    expect(service.isFavorite(book.id)).toBeFalse();
  });
});