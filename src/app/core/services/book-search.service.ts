import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Book } from '../../models/book.model';
import { GoogleBooksSearchRequest } from '../../models/google-books-search-request.model';
import { ExploreFilter } from '../../types/explore-filter.type';
import { BookExploreRankingService } from './book-explore-ranking.service';
import { BookSearchErrorTranslatorService } from './book-search-error-translator.service';
import { GoogleBooksApiClientService } from './google-books-api-client.service';
import { GoogleBooksBookMapperService } from './google-books-book-mapper.service';

@Injectable({
  providedIn: 'root',
})
export class BookSearchService {
  private readonly pageSize = 18;
  private readonly maxExploreResults = 40;

  constructor(
    private googleBooksApiClient: GoogleBooksApiClientService,
    private googleBooksBookMapper: GoogleBooksBookMapperService,
    private bookExploreRanking: BookExploreRankingService,
    private errorTranslator: BookSearchErrorTranslatorService,
  ) {}

  searchBooks(
    query: string,
    page = 1,
  ): Observable<{ books: Book[]; totalItems: number }> {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return of({ books: [], totalItems: 0 });
    }

    const request: GoogleBooksSearchRequest = {
      query: normalizedQuery,
      maxResults: this.pageSize,
      orderBy: 'relevance',
      startIndex: (page - 1) * this.pageSize,
    };

    return this.googleBooksApiClient.searchVolumes(request).pipe(
      map((response) => ({
        books: this.googleBooksBookMapper.mapVolumesToBooks(
          response.items ?? [],
        ),
        totalItems: response.totalItems ?? 0,
      })),
      catchError((error) =>
        throwError(() => this.errorTranslator.toSearchError(error)),
      ),
    );
  }

  exploreBooks(filter: ExploreFilter): Observable<Book[]> {
    const request: GoogleBooksSearchRequest = {
      query: this.bookExploreRanking.getExploreQuery(filter),
      maxResults: this.maxExploreResults,
      orderBy: 'relevance',
    };

    return this.googleBooksApiClient.searchVolumes(request).pipe(
      map((response) => response.items ?? []),
      map((volumes) =>
        this.bookExploreRanking.sortVolumesForExplore(volumes, filter),
      ),
      map((volumes) => volumes.slice(0, this.pageSize)),
      map((volumes) => this.googleBooksBookMapper.mapVolumesToBooks(volumes)),
      catchError((error) =>
        throwError(() => this.errorTranslator.toExploreError(error)),
      ),
    );
  }
}
