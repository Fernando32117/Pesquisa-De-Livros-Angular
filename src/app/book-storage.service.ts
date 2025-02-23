import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookStorageService {
  private favorites: any[] = [];

  getFavorites(): any[] {
    return this.favorites;
  }

  addFavorite(book: any): void {
    this.favorites.push(book);
  }

  removeFavorite(bookId: string): void {
    this.favorites = this.favorites.filter(book => book.id !== bookId);
  }
}
