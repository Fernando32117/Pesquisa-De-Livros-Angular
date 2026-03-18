import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { BookSearchService } from '../../../core/services/book-search.service';
import { BookListComponent } from '../book-list/book-list.component';
import { Book } from '../../../models/book.model';
import {
  DEFAULT_EXPLORE_FILTER,
} from '../../../constants/default-explore-filter.constant';
import { EXPLORE_FILTER_OPTIONS } from '../../../constants/explore-filter-options.constant';
import { ExploreFilterOption } from '../../../models/explore-filter-option.model';
import { ExploreFilter } from '../../../types/explore-filter.type';
import { BookDiscoveryPanelComponent } from '../book-discovery-panel/book-discovery-panel.component';
import { BookRecommendationsSectionComponent } from '../book-recommendations-section/book-recommendations-section.component';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.css'],
  imports: [
    CommonModule,
    BookListComponent,
    BookDiscoveryPanelComponent,
    BookRecommendationsSectionComponent,
  ],
})
export class BookSearchComponent implements OnInit {
  query = '';
  books: Book[] = [];
  recommendedBooks: Book[] = [];
  isLoading = false;
  isRecommendationsLoading = false;
  errorMessage = '';
  recommendationsErrorMessage = '';
  hasSearched = false;
  hasLoadedRecommendations = false;
  selectedExploreFilter: ExploreFilter = DEFAULT_EXPLORE_FILTER;
  readonly exploreFilterOptions: readonly ExploreFilterOption[] =
    EXPLORE_FILTER_OPTIONS;

  constructor(private booksService: BookSearchService) {}

  ngOnInit(): void {
    this.loadRecommendedBooks();
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

  onExploreFilterSelect(filter: ExploreFilter): void {
    if (
      this.selectedExploreFilter === filter &&
      this.hasLoadedRecommendations
    ) {
      return;
    }

    this.selectedExploreFilter = filter;
    this.loadRecommendedBooks();
  }

  private loadRecommendedBooks(): void {
    this.isRecommendationsLoading = true;
    this.recommendationsErrorMessage = '';

    this.booksService
      .exploreBooks(this.selectedExploreFilter)
      .pipe(finalize(() => (this.isRecommendationsLoading = false)))
      .subscribe({
        next: (books) => {
          this.recommendedBooks = books;
          this.hasLoadedRecommendations = true;
        },
        error: (error: Error) => {
          this.recommendedBooks = [];
          this.recommendationsErrorMessage = error.message;
          this.hasLoadedRecommendations = true;
        },
      });
  }
}
