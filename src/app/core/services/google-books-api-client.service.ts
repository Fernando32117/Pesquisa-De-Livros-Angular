import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GoogleBookVolume } from '../../models/google-book-volume.model';
import { GoogleBooksSearchRequest } from '../../models/google-books-search-request.model';
import { GoogleBooksSearchResponse } from '../../models/google-books-search-response.model';

@Injectable({
  providedIn: 'root',
})
export class GoogleBooksApiClientService {
  private readonly googleBooksApiUrl =
    'https://www.googleapis.com/books/v1/volumes';
  private readonly googleBooksApiKey = (environment.googleBooksApiKey ?? '').trim();
  private hasWarnedMissingApiKey = false;

  constructor(private http: HttpClient) {}

  searchVolumes(
    request: GoogleBooksSearchRequest,
  ): Observable<GoogleBookVolume[]> {
    const params = this.buildParams(request);

    return this.http
      .get<GoogleBooksSearchResponse>(this.googleBooksApiUrl, { params })
      .pipe(map((response) => response.items ?? []));
  }

  private buildParams(request: GoogleBooksSearchRequest): HttpParams {
    let params = new HttpParams()
      .set('q', request.query)
      .set('maxResults', request.maxResults.toString())
      .set('orderBy', request.orderBy)
      .set('printType', 'books');

    if (this.googleBooksApiKey) {
      params = params.set('key', this.googleBooksApiKey);
    } else {
      this.warnMissingApiKey();
    }

    return params;
  }

  private warnMissingApiKey(): void {
    if (this.hasWarnedMissingApiKey) {
      return;
    }

    console.warn(
      '[GoogleBooksApiClientService] GOOGLE_BOOKS_API_KEY nao configurada. Use .env/.env.prod e rode o script de build/start.',
    );
    this.hasWarnedMissingApiKey = true;
  }
}
