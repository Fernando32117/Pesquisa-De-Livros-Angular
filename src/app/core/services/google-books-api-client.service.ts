import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GoogleBookVolume } from '../models/google-book-volume.model';
import { GoogleBooksSearchRequest } from '../models/google-books-search-request.model';
import { GoogleBooksSearchResponse } from '../models/google-books-search-response.model';

@Injectable({
  providedIn: 'root',
})
export class GoogleBooksApiClientService {
  private readonly googleBooksApiUrl =
    'https://www.googleapis.com/books/v1/volumes';

  constructor(private http: HttpClient) {}

  searchVolumes(request: GoogleBooksSearchRequest): Observable<GoogleBookVolume[]> {
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

    const googleBooksApiKey = environment.googleBooksApiKey.trim();

    if (googleBooksApiKey) {
      params = params.set('key', googleBooksApiKey);
    }

    return params;
  }
}
