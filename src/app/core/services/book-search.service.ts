import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Book } from '../../shared/models/book.model';

interface OpenLibrarySearchResponse {
  docs?: OpenLibraryBookDoc[];
}

interface OpenLibraryBookDoc {
  key?: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  publisher?: string[];
  cover_i?: number;
  cover_edition_key?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookSearchService {
  private readonly apiUrl = 'https://openlibrary.org/search.json';

  constructor(private http: HttpClient) {}

  searchBooks(query: string): Observable<Book[]> {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return of([]);
    }

    const params = new HttpParams()
      .set('q', normalizedQuery)
      .set('limit', '20')
      .set(
        'fields',
        'key,title,author_name,first_publish_year,publisher,cover_i,cover_edition_key'
      );

    return this.http.get<OpenLibrarySearchResponse>(this.apiUrl, { params }).pipe(
      map((response) =>
        (response.docs ?? [])
          .map((doc) => this.mapDocToBook(doc))
          .filter((book) => !!book.title)
      ),
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

  private mapDocToBook(doc: OpenLibraryBookDoc): Book {
    const key = doc.key ?? '';
    const openLibraryUrl = key ? `https://openlibrary.org${key}` : undefined;

    return {
      id: key || `${doc.title ?? 'book'}-${doc.first_publish_year ?? 'unknown'}`,
      title: doc.title ?? 'Sem titulo',
      authors: doc.author_name ?? ['Autor desconhecido'],
      publishedDate: doc.first_publish_year?.toString(),
      publisher: doc.publisher?.[0],
      thumbnail: this.buildCoverUrl(doc),
      infoUrl: openLibraryUrl,
      readUrl: openLibraryUrl,
    };
  }

  private buildCoverUrl(doc: OpenLibraryBookDoc): string | undefined {
    if (doc.cover_i) {
      return `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
    }

    const editionOlid = doc.cover_edition_key;

    if (editionOlid) {
      return `https://covers.openlibrary.org/b/olid/${encodeURIComponent(editionOlid)}-M.jpg`;
    }

    return undefined;
  }
}
