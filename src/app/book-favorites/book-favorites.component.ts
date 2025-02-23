import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookStorageService } from '../book-storage.service';

@Component({
  selector: 'app-book-favorites',
  templateUrl: './book-favorites.component.html',
  styleUrls: ['./book-favorites.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class BookFavoritesComponent {
  favorites: any[] = [];

  constructor(private bookStorage: BookStorageService) {
    this.favorites = this.bookStorage.getFavorites();
  }

  removeFavorite(bookId: string): void {
    this.bookStorage.removeFavorite(bookId);
    this.favorites = this.bookStorage.getFavorites();
  }
}
