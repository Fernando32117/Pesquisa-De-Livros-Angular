import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Book } from '../../shared/models/book.model';
import { ExploreFilter } from '../../types/explore-filter.type';
import { GoogleBooksSearchRequest } from '../models/google-books-search-request.model';
import { BookExploreRankingService } from './book-explore-ranking.service';
import { BookSearchErrorTranslatorService } from './book-search-error-translator.service';
import { GoogleBooksApiClientService } from './google-books-api-client.service';
import { GoogleBooksBookMapperService } from './google-books-book-mapper.service';

@Injectable({
  providedIn: 'root',
})
export class BookSearchService {
  private readonly maxResults = 20;
  private readonly maxExploreResults = 40;

  constructor(
    private googleBooksApiClient: GoogleBooksApiClientService,
    private googleBooksBookMapper: GoogleBooksBookMapperService,
    private bookExploreRanking: BookExploreRankingService,
    private errorTranslator: BookSearchErrorTranslatorService,
  ) {}

  searchBooks(query: string): Observable<Book[]> {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return of([]);
    }

    const request: GoogleBooksSearchRequest = {
      query: normalizedQuery,
      maxResults: this.maxResults,
      orderBy: 'relevance',
    };

    return this.googleBooksApiClient.searchVolumes(request).pipe(
      map((volumes) => this.googleBooksBookMapper.mapVolumesToBooks(volumes)),
      catchError((error) => throwError(() => this.errorTranslator.toSearchError(error))),
    );
  }

  exploreBooks(filter: ExploreFilter): Observable<Book[]> {
    const request: GoogleBooksSearchRequest = {
      query: this.bookExploreRanking.getExploreQuery(filter),
      maxResults: this.maxExploreResults,
      orderBy: 'relevance',
    };

    return this.googleBooksApiClient.searchVolumes(request).pipe(
      map((volumes) => this.bookExploreRanking.sortVolumesForExplore(volumes, filter)),
      map((volumes) => volumes.slice(0, this.maxResults)),
      map((volumes) => this.googleBooksBookMapper.mapVolumesToBooks(volumes)),
      catchError((error) => throwError(() => this.errorTranslator.toExploreError(error))),
    );
  }
}
