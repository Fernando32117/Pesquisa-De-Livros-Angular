import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  openModal(book: any): void {
    this.selectedBook = book;
  }

  closeModal(): void {
    this.selectedBook = null;
  }
}
