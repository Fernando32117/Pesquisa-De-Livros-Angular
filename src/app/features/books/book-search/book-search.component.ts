import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { BookSearchService } from '../../../core/services/book-search.service';
import { BookListComponent } from '../book-list/book-list.component';
import { AuthService } from '../../../core/services/auth.service';
import { Book } from '../../../shared/models/book.model';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.css'],
  imports: [CommonModule, FormsModule, BookListComponent],
})
export class BookSearchComponent {
  query = '';
  books: Book[] = [];
  isLoading = false;
  errorMessage = '';
  hasSearched = false;
  isLoggedIn = false;

  constructor(
    private booksService: BookSearchService,
    private authService: AuthService
  ) {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  searchBooks(): void {
    const normalizedQuery = this.query.trim();

    this.hasSearched = true;
    this.errorMessage = '';
    this.books = [];

    if (!normalizedQuery) {
      return;
    }

    this.isLoading = true;

    this.booksService
      .searchBooks(normalizedQuery)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (books) => {
          this.books = books;
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        },
      });
  }

  canFavorite(): boolean {
    return this.authService.isAuthenticated();
  }
}
