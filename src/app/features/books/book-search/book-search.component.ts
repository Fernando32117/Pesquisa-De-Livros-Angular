import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { BookSearchService } from '../../../core/services/book-search.service';
import { BookListComponent } from '../book-list/book-list.component';
import { Book } from '../../../models/book.model';
import { DEFAULT_EXPLORE_FILTER } from '../../../constants/default-explore-filter.constant';
import { EXPLORE_FILTER_OPTIONS } from '../../../constants/explore-filter-options.constant';
import { ExploreFilterOption } from '../../../models/explore-filter-option.model';
import { ExploreFilter } from '../../../types/explore-filter.type';
import { BookDiscoveryPanelComponent } from '../book-discovery-panel/book-discovery-panel.component';
import { BookRecommendationsSectionComponent } from '../book-recommendations-section/book-recommendations-section.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.css'],
  imports: [
    CommonModule,
    BookListComponent,
    BookDiscoveryPanelComponent,
    BookRecommendationsSectionComponent,
    PaginationComponent,
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
  showExploreFilters = true;
  selectedExploreFilter: ExploreFilter = DEFAULT_EXPLORE_FILTER;
  readonly exploreFilterOptions: readonly ExploreFilterOption[] =
    EXPLORE_FILTER_OPTIONS;

  currentPage = 1;
  totalItems = 0;
  readonly itemsPerPage = 18;
  private lastSearchedQuery = '';

  get totalPages(): number {
    // Google Books API caps usable results at ~1000 (startIndex limit)
    return Math.min(Math.ceil(this.totalItems / this.itemsPerPage), 56);
  }

  constructor(private booksService: BookSearchService) {}

  ngOnInit(): void {
    this.loadRecommendedBooks();
  }

  searchBooks(): void {
    const normalizedQuery = this.query.trim();

    this.errorMessage = '';
    this.books = [];
    this.totalItems = 0;

    if (!normalizedQuery) {
      this.hasSearched = false;
      this.showExploreFilters = true;
      return;
    }

    this.hasSearched = true;
    this.showExploreFilters = false;
    this.currentPage = 1;
    this.lastSearchedQuery = normalizedQuery;
    this.executeSearch(normalizedQuery, 1);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.books = [];
    this.executeSearch(this.lastSearchedQuery, page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

  private executeSearch(query: string, page: number): void {
    this.isLoading = true;

    this.booksService
      .searchBooks(query, page)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: ({ books, totalItems }) => {
          this.books = books;
          this.totalItems = totalItems;
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        },
      });
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
