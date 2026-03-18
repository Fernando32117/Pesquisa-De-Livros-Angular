import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BookStorageService } from '../../../core/services/book-storage.service';
import { Book } from '../../../models/book.model';
import { BookFavoritesState } from '../../../models/book-favorites-state.model';
import { filterFavorites } from '../../../utils/book-favorites-filter.util';

const PAGE_SIZE = 18;

const INITIAL_STATE: BookFavoritesState = {
  favorites: [],
  filteredFavorites: [],
  pagedFavorites: [],
  selectedBook: null,
  filter: '',
  notificationMessage: null,
  currentPage: 1,
  totalPages: 0,
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
      const filteredFavorites = filterFavorites(
        favorites,
        this.snapshot.filter,
      );
      this.patchState({
        favorites,
        filteredFavorites,
        ...this.computePagination(filteredFavorites, 1),
      });
    });

    const favorites = this.bookStorage.getFavorites();
    const filteredFavorites = filterFavorites(favorites, this.snapshot.filter);
    this.patchState({
      favorites,
      filteredFavorites,
      ...this.computePagination(filteredFavorites, 1),
    });
  }

  destroy(): void {
    this.favoritesSubscription?.unsubscribe();
  }

  setFilter(filter: string): void {
    const filteredFavorites = filterFavorites(this.snapshot.favorites, filter);
    this.patchState({
      filter,
      filteredFavorites,
      ...this.computePagination(filteredFavorites, 1),
    });
  }

  goToPage(page: number): void {
    const { filteredFavorites, totalPages } = this.snapshot;
    if (page < 1 || page > totalPages) return;
    this.patchState(this.computePagination(filteredFavorites, page));
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

  private computePagination(
    filteredFavorites: Book[],
    page: number,
  ): Pick<BookFavoritesState, 'pagedFavorites' | 'currentPage' | 'totalPages'> {
    const totalPages = Math.ceil(filteredFavorites.length / PAGE_SIZE);
    const safePage = totalPages === 0 ? 1 : Math.min(page, totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    return {
      pagedFavorites: filteredFavorites.slice(start, start + PAGE_SIZE),
      currentPage: safePage,
      totalPages,
    };
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
