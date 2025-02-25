import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookStorageService } from '../book-storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-book-favorites',
  templateUrl: './book-favorites.component.html',
  styleUrls: ['./book-favorites.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class BookFavoritesComponent implements OnInit {
  favorites: any[] = [];
  filteredFavorites: any[] = [];
  selectedBook: any = null;
  filter: string = '';
  private subscription: Subscription;

  notificationMessage: string | null = null;

  ngOnInit(): void {
    this.applyFilter();
  }

  constructor(private bookStorage: BookStorageService) {
    this.subscription = this.bookStorage.favorites$.subscribe((favorites) => {
      this.favorites = favorites;
      this.applyFilter();
    });
  }

  removeFavorite(bookId: string): void {
    this.bookStorage.removeFavorite(bookId);
    this.showNotification("Livro removido dos favoritos!");
  }

  openModal(book: any): void {
    const favorite = this.bookStorage
      .getFavorites()
      .find((fav) => fav.id === book.id);
    this.selectedBook = favorite
      ? { ...book, ...favorite }
      : { ...book, notes: '', rating: 0, tags: [] };
  }

  closeModal(): void {
    this.selectedBook = null;
  }

  updateFavorite(book: any): void {
    this.bookStorage.updateFavorite(book);
    this.showNotification("Livro atualizado com sucesso!");
    this.closeModal();
  }

  applyFilter(): void {
    if (this.filter) {
      const filter = this.filter.toLowerCase();
      this.filteredFavorites = this.favorites.filter(
        (book) =>
          (Array.isArray(book.tags) &&
            book.tags.some((tag: string) =>
              tag.toLowerCase().includes(filter)
            )) ||
          book.volumeInfo.title.toLowerCase().includes(filter)
      );
    } else {
      this.filteredFavorites = this.favorites;
    }
  }

  showNotification(message: string): void {
    this.notificationMessage = message;
    setTimeout(() => this.notificationMessage = null, 4500);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

