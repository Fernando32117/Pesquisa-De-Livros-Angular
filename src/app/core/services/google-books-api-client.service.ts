import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GoogleBookVolume } from '../../models/google-book-volume.model';
import { GoogleBooksSearchRequest } from '../../models/google-books-search-request.model';
import { GoogleBooksSearchResponse } from '../../models/google-books-search-response.model';
import { BASE_URL } from '../../tokens/base-url.token';

@Injectable({
  providedIn: 'root',
})
export class GoogleBooksApiClientService {
  private readonly apiPath = '/api/books';

  constructor(
    private http: HttpClient,
    @Optional() @Inject(BASE_URL) private baseUrl: string,
  ) {}

  searchVolumes(
    request: GoogleBooksSearchRequest,
  ): Observable<GoogleBookVolume[]> {
    const url = `${this.baseUrl ?? ''}${this.apiPath}`;
    const params = this.buildParams(request);

    return this.http
      .get<GoogleBooksSearchResponse>(url, { params })
      .pipe(map((response) => response.items ?? []));
  }

  private buildParams(request: GoogleBooksSearchRequest): HttpParams {
    return new HttpParams()
      .set('q', request.query)
      .set('maxResults', request.maxResults.toString())
      .set('orderBy', request.orderBy)
      .set('printType', 'books');
  }
}
