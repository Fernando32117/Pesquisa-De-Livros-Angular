import { TestBed } from '@angular/core/testing';
import { BookStorageService } from './book-storage.service';

describe('BookStorageService', () => {
  let service: BookStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a book to favorites', () => {
    const book = { id: '1', title: 'Test Book' };
    service.addFavorite(book);
    expect(service.getFavorites()).toContain(book);
  });

  it('should remove a book from favorites', () => {
    const book = { id: '1', title: 'Test Book' };
    service.addFavorite(book);
    service.removeFavorite(book.id);
    expect(service.getFavorites()).not.toContain(book);
  });

  it('should update a favorite book', () => {
    const book = { id: '1', title: 'Test Book', notes: '' };
    const updatedBook = { ...book, notes: 'Updated notes' };
    service.addFavorite(book);
    service.updateFavorite(updatedBook);
    expect(service.getFavorites().find(b => b.id === book.id)?.notes).toBe('Updated notes');
  });

  it('should check if a book is a favorite', () => {
    const book = { id: '1', title: 'Test Book' };
    service.addFavorite(book);
    expect(service.isFavorite(book.id)).toBeTrue();
    service.removeFavorite(book.id);
    expect(service.isFavorite(book.id)).toBeFalse();
  });
});
