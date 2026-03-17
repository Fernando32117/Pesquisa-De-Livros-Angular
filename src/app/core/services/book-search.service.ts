import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Book } from '../../shared/models/book.model';
import { GoogleBookImageLinks } from '../models/google-book-image-links.model';
import { GoogleBooksSearchResponse } from '../models/google-books-search-response.model';
import { GoogleBookVolume } from '../models/google-book-volume.model';

@Injectable({
  providedIn: 'root',
})
export class BookSearchService {
  private readonly googleBooksApiUrl = 'https://www.googleapis.com/books/v1/volumes';
  private readonly maxResults = 20;

  constructor(private http: HttpClient) {}

  searchBooks(query: string): Observable<Book[]> {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return of([]);
    }

    return this.searchGoogleBooks(normalizedQuery).pipe(
      catchError((error) => {
        if (error?.status === 429 || error?.status === 403) {
          return throwError(
            () =>
              new Error(
                'A API de livros esta temporariamente limitada. Tente novamente em alguns minutos.'
              )
          );
        }

        return throwError(
          () =>
            new Error(
              'Nao foi possivel buscar livros agora. Verifique sua conexao e tente novamente.'
            )
        );
      })
    );
  }

  private searchGoogleBooks(query: string): Observable<Book[]> {
    let params = new HttpParams()
      .set('q', query)
      .set('maxResults', this.maxResults.toString())
      .set('orderBy', 'relevance')
      .set('printType', 'books');

    const googleBooksApiKey = environment.googleBooksApiKey.trim();

    if (googleBooksApiKey) {
      params = params.set('key', googleBooksApiKey);
    }

    return this.http
      .get<GoogleBooksSearchResponse>(this.googleBooksApiUrl, { params })
      .pipe(
        map((response) =>
          (response.items ?? [])
            .map((item) => this.mapVolumeToBook(item))
            .filter((book) => !!book.title)
        )
      );
  }

  private mapVolumeToBook(volume: GoogleBookVolume): Book {
    const volumeInfo = volume.volumeInfo ?? {};
    const accessInfo = volume.accessInfo ?? {};
    const saleInfo = volume.saleInfo ?? {};
    const title = volumeInfo.title ?? 'Sem titulo';

    return {
      id: volume.id ?? `${title}-${volumeInfo.publishedDate ?? 'unknown'}`,
      title,
      authors: volumeInfo.authors ?? ['Autor desconhecido'],
      description: volumeInfo.description,
      publishedDate: volumeInfo.publishedDate,
      publisher: volumeInfo.publisher,
      thumbnail: this.buildCoverUrl(volumeInfo.imageLinks),
      infoUrl: volumeInfo.infoLink ?? volumeInfo.canonicalVolumeLink,
      readUrl:
        accessInfo.webReaderLink ??
        volumeInfo.infoLink ??
        volumeInfo.canonicalVolumeLink,
      buyUrl: saleInfo.buyLink,
      pdfUrl: accessInfo.pdf?.acsTokenLink,
    };
  }

  private buildCoverUrl(imageLinks?: GoogleBookImageLinks): string | undefined {
    if (!imageLinks?.thumbnail && !imageLinks?.smallThumbnail) {
      return undefined;
    }

    return (imageLinks.thumbnail ?? imageLinks.smallThumbnail)?.replace(
      'http://',
      'https://'
    );
  }
}
