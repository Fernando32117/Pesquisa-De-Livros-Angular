import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Book } from '../../../models/book.model';
import { NotificationModalComponent } from '../../../shared/components/notification-modal/notification-modal.component';
import { BookDetailsModalComponent } from '../book-details-modal/book-details-modal.component';
import { FavoritesEmptyStateComponent } from './favorites-empty-state/favorites-empty-state.component';
import { FavoritesGridComponent } from './favorites-grid/favorites-grid.component';
import { FavoritesHeaderComponent } from './favorites-header/favorites-header.component';
import { BookFavoritesFacade } from './book-favorites.facade';
import { BookFavoritesState } from '../../../models/book-favorites-state.model';

@Component({
  selector: 'app-book-favorites',
  templateUrl: './book-favorites.component.html',
  styleUrls: ['./book-favorites.component.css'],
  imports: [
    CommonModule,
    FavoritesHeaderComponent,
    FavoritesGridComponent,
    FavoritesEmptyStateComponent,
    BookDetailsModalComponent,
    NotificationModalComponent,
  ],
  providers: [BookFavoritesFacade],
})
export class BookFavoritesComponent implements OnInit, OnDestroy {
  favorites: Book[] = [];
  filteredFavorites: Book[] = [];
  selectedBook: Book | null = null;
  filter = '';
  notificationMessage: string | null = null;
  readonly fallbackImage = '/notimg.jpg';

  private stateSubscription: Subscription | null = null;

  constructor(private favoritesFacade: BookFavoritesFacade) {}

  ngOnInit(): void {
    this.stateSubscription = this.favoritesFacade.state$.subscribe((state) => {
      this.updateViewState(state);
    });

    this.favoritesFacade.init();
  }

  removeFavorite(bookId: string): void {
    this.favoritesFacade.removeFavorite(bookId);
  }

  openModal(book: Book): void {
    this.favoritesFacade.openDetails(book);
  }

  closeModal(): void {
    this.favoritesFacade.closeDetails();
  }

  applyFilter(): void {
    this.favoritesFacade.setFilter(this.filter);
  }

  clearNotification(): void {
    this.favoritesFacade.clearNotification();
  }

  ngOnDestroy(): void {
    this.stateSubscription?.unsubscribe();
    this.favoritesFacade.destroy();
  }

  private updateViewState(state: BookFavoritesState): void {
    this.favorites = state.favorites;
    this.filteredFavorites = state.filteredFavorites;
    this.selectedBook = state.selectedBook;
    this.filter = state.filter;
    this.notificationMessage = state.notificationMessage;
  }
}
