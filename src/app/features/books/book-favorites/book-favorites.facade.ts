import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BookStorageService } from '../../../core/services/book-storage.service';
import { Book } from '../../../models/book.model';
import { BookFavoritesState } from '../../../models/book-favorites-state.model';
import { filterFavorites } from '../../../utils/book-favorites-filter.util';

const INITIAL_STATE: BookFavoritesState = {
  favorites: [],
  filteredFavorites: [],
  selectedBook: null,
  filter: '',
  notificationMessage: null,
};

@Injectable()
export class BookFavoritesFacade {
  private readonly stateSubject = new BehaviorSubject<BookFavoritesState>(
    INITIAL_STATE,
  );
  readonly state$ = this.stateSubject.asObservable();
  private favoritesSubscription: Subscription | null = null;

  constructor(private bookStorage: BookStorageService) {}

  init(): void {
    this.favoritesSubscription = this.bookStorage.favorites$.subscribe(() => {
      const favorites = this.bookStorage.getFavorites();
      this.patchState({
        favorites,
        filteredFavorites: filterFavorites(favorites, this.snapshot.filter),
      });
    });

    const favorites = this.bookStorage.getFavorites();
    this.patchState({
      favorites,
      filteredFavorites: filterFavorites(favorites, this.snapshot.filter),
    });
  }

  destroy(): void {
    this.favoritesSubscription?.unsubscribe();
  }

  setFilter(filter: string): void {
    this.patchState({
      filter,
      filteredFavorites: filterFavorites(this.snapshot.favorites, filter),
    });
  }

  openDetails(book: Book): void {
    const favorite = this.snapshot.favorites.find((fav) => fav.id === book.id);

    this.patchState({
      selectedBook: favorite ? { ...book, ...favorite } : { ...book },
    });
  }

  closeDetails(): void {
    this.patchState({ selectedBook: null });
  }

  async removeFavorite(bookId: string): Promise<void> {
    await this.bookStorage.removeFavorite(bookId);
  }

  clearNotification(): void {
    this.patchState({ notificationMessage: null });
  }

  private showNotification(message: string): void {
    this.patchState({ notificationMessage: message });

    setTimeout(() => {
      this.patchState({ notificationMessage: null });
    }, 4500);
  }

  private patchState(partialState: Partial<BookFavoritesState>): void {
    this.stateSubject.next({
      ...this.snapshot,
      ...partialState,
    });
  }

  private get snapshot(): BookFavoritesState {
    return this.stateSubject.value;
  }
}
