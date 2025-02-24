import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookStorageService } from '../book-storage.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class BookListComponent {
  @Input() books: any[] = [];
  selectedBook: any = null;

  constructor(private bookStorage: BookStorageService) {}

  openModal(book: any): void {
    this.selectedBook = { ...book, ...this.bookStorage.getFavorites().find(fav => fav.id === book.id) };
  }

  closeModal(): void {
    this.selectedBook = null;
  }

  toggleFavorite(book: any): void {
    if (this.isFavorite(book)) {
      this.bookStorage.removeFavorite(book.id);
    } else {
      this.openModal(book);
    }
  }

  saveFavorite(book: any): void {
    this.bookStorage.addFavorite(book);
    this.closeModal();
  }

  updateFavorite(book: any): void {
    this.bookStorage.updateFavorite(book);
    this.closeModal();
  }

  isFavorite(book: any): boolean {
    return this.bookStorage.isFavorite(book.id);
  }
}
