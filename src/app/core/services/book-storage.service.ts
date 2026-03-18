import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Book } from '../../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookStorageService {
  private favorites: Book[] = this.loadFavorites();
  private favoritesSubject = new BehaviorSubject<Book[]>(this.favorites);
  favorites$ = this.favoritesSubject.asObservable();

  private notificationSubject = new BehaviorSubject<string | null>(null);
  notification$ = this.notificationSubject.asObservable();

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private getLoggedInUser(): string | null {
    if (!this.isBrowser()) {
      return null;
    }

    return localStorage.getItem('loggedInUser');
  }

  private getUserFavoritesKey(): string {
    const user = this.getLoggedInUser();
    return user ? `favorites_${user}` : 'favorites_guest';
  }

  getFavorites(): Book[] {
    return this.favorites;
  }

  addFavorite(book: Book): void {
    const normalizedBook = this.normalizeBook(book);

    if (this.isFavorite(normalizedBook.id)) {
      return;
    }

    this.favorites = [...this.favorites, normalizedBook];
    this.saveFavorites();
    this.favoritesSubject.next(this.favorites);
    this.showNotification('Livro favoritado com sucesso!');
  }

  updateFavorite(book: Book): void {
    const normalizedBook = this.normalizeBook(book);

    this.favorites = this.favorites.map((currentBook) =>
      currentBook.id === normalizedBook.id ? normalizedBook : currentBook,
    );

    this.saveFavorites();
    this.favoritesSubject.next(this.favorites);
    this.showNotification('Livro editado com sucesso!');
  }

  removeFavorite(bookId: string): void {
    this.favorites = this.favorites.filter((book) => book.id !== bookId);
    this.saveFavorites();
    this.favoritesSubject.next(this.favorites);
    this.showNotification('Livro removido dos favoritos com sucesso!');
  }

  isFavorite(bookId: string): boolean {
    return this.favorites.some((book) => book.id === bookId);
  }

  private saveFavorites(): void {
    if (!this.isBrowser()) {
      return;
    }

    const key = this.getUserFavoritesKey();
    localStorage.setItem(key, JSON.stringify(this.favorites));
  }

  private loadFavorites(): Book[] {
    if (!this.isBrowser()) {
      return [];
    }

    const key = this.getUserFavoritesKey();
    const storedFavorites = localStorage.getItem(key);

    if (!storedFavorites) {
      return [];
    }

    try {
      const parsedFavorites = JSON.parse(storedFavorites);

      if (!Array.isArray(parsedFavorites)) {
        return [];
      }

      return parsedFavorites.map((book) => this.normalizeBook(book));
    } catch {
      return [];
    }
  }

  private normalizeBook(rawBook: any): Book {
    const legacyVolumeInfo = rawBook?.volumeInfo ?? {};
    const legacyAccessInfo = rawBook?.accessInfo ?? {};
    const legacySaleInfo = rawBook?.saleInfo ?? {};

    const title = rawBook?.title ?? legacyVolumeInfo?.title ?? 'Sem titulo';
    const id = String(
      rawBook?.id ??
        rawBook?.key ??
        legacyVolumeInfo?.canonicalVolumeLink ??
        `${title}-${legacyVolumeInfo?.publishedDate ?? 'unknown'}`,
    );

    const authors = rawBook?.authors ??
      legacyVolumeInfo?.authors ??
      (rawBook?.author_name as string[] | undefined) ?? ['Autor desconhecido'];

    return {
      id,
      title,
      authors: Array.isArray(authors) ? authors : [String(authors)],
      description: rawBook?.description ?? legacyVolumeInfo?.description,
      publishedDate: rawBook?.publishedDate ?? legacyVolumeInfo?.publishedDate,
      publisher: rawBook?.publisher ?? legacyVolumeInfo?.publisher,
      thumbnail: rawBook?.thumbnail ?? legacyVolumeInfo?.imageLinks?.thumbnail,
      infoUrl: rawBook?.infoUrl ?? legacyVolumeInfo?.infoLink,
      readUrl:
        rawBook?.readUrl ??
        legacyAccessInfo?.webReaderLink ??
        rawBook?.infoUrl ??
        legacyVolumeInfo?.infoLink,
      buyUrl: rawBook?.buyUrl ?? legacySaleInfo?.buyLink,
      pdfUrl: rawBook?.pdfUrl ?? legacyAccessInfo?.pdf?.acsTokenLink,
      notes: rawBook?.notes ?? '',
      rating: Number(rawBook?.rating ?? 0),
      tags: this.normalizeTags(rawBook?.tags),
    };
  }

  private normalizeTags(tags: string[] | string | undefined): string[] {
    if (!tags) {
      return [];
    }

    if (Array.isArray(tags)) {
      return tags.map((tag) => tag.trim()).filter(Boolean);
    }

    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  private showNotification(message: string): void {
    this.notificationSubject.next(message);

    setTimeout(() => {
      this.notificationSubject.next(null);
    }, 3000);
  }
}
