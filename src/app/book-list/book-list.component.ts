import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookStorageService } from '../book-storage.service';

@Component({
    selector: 'app-book-list',
    templateUrl: './book-list.component.html',
    styleUrls: ['./book-list.component.css'],
    imports: [CommonModule, FormsModule]
})
export class BookListComponent {
  @Input() books: any[] = [];
  selectedBook: any = null;

  notificationMessage: string | null = null;


  constructor(private bookStorage: BookStorageService) {}

  openModal(book: any): void {
    const favorite = this.bookStorage.getFavorites().find(fav => fav.id === book.id);
    this.selectedBook = favorite ? { ...book, ...favorite } : { ...book, notes: '', rating: 0, tags: [] };
  }

  closeModal(): void {
    this.selectedBook = null;
  }

  toggleFavorite(book: any): void {
    if (this.isFavorite(book)) {
      this.bookStorage.removeFavorite(book.id);
      this.showNotification("Livro removido dos favoritos!");
    } else {
      this.openModal(book);
    }
  }

  saveFavorite(book: any): void {
    this.bookStorage.addFavorite(book);
    this.showNotification("Livro favoritado com sucesso!");
    this.closeModal();
  }

  updateFavorite(book: any): void {
    this.bookStorage.updateFavorite(book);
    this.showNotification("Livro atualizado com sucesso!");
    this.closeModal();
  }

  showNotification(message: string): void {
    this.notificationMessage = message;
    setTimeout(() => this.notificationMessage = null, 4500);
  }

  isFavorite(book: any): boolean {
    return this.bookStorage.isFavorite(book.id);
  }
}
