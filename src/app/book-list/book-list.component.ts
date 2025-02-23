// import { Component, Input } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { BookStorageService } from '../book-storage.service';

// @Component({
//   selector: 'app-book-list',
//   templateUrl: './book-list.component.html',
//   styleUrls: ['./book-list.component.css'],
//   standalone: true,
//   imports: [CommonModule]
// })
// export class BookListComponent {
//   @Input() books: any[] = [];
//   selectedBook: any = null;

//   constructor(private bookStorage: BookStorageService) {}

//   openModal(book: any): void {
//     this.selectedBook = book;
//   }

//   closeModal(): void {
//     this.selectedBook = null;
//   }

//   toggleFavorite(book: any): void {
//     if (this.isFavorite(book)) {
//       this.bookStorage.removeFavorite(book.id);
//     } else {
//       this.bookStorage.addFavorite(book);
//     }
//   }

//   isFavorite(book: any): boolean {
//     return this.bookStorage.getFavorites().some(fav => fav.id === book.id);
//   }
// }


import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookStorageService } from '../book-storage.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class BookListComponent {
  @Input() books: any[] = [];
  selectedBook: any = null;

  constructor(private bookStorage: BookStorageService) {}

  openModal(book: any): void {
    this.selectedBook = book;
  }

  closeModal(): void {
    this.selectedBook = null;
  }

  toggleFavorite(book: any): void {
    if (this.isFavorite(book)) {
      this.bookStorage.removeFavorite(book.id);
    } else {
      this.bookStorage.addFavorite(book);
    }
  }

  isFavorite(book: any): boolean {
    return this.bookStorage.isFavorite(book.id);
  }
}

