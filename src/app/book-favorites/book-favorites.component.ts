import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookStorageService } from '../book-storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-book-favorites',
  templateUrl: './book-favorites.component.html',
  styleUrls: ['./book-favorites.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class BookFavoritesComponent {
  favorites: any[] = [];
  selectedBook: any = null;
  private subscription: Subscription;

  constructor(private bookStorage: BookStorageService) {
    this.subscription = this.bookStorage.favorites$.subscribe(favorites => {
      this.favorites = favorites;
    });
  }

  removeFavorite(bookId: string): void {
    this.bookStorage.removeFavorite(bookId);
  }

  openModal(book: any): void {
    this.selectedBook = book;
  }

  closeModal(): void {
    this.selectedBook = null;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
