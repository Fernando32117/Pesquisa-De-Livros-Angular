import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Book } from '../../shared/models/book.model';
import { ExploreFilter } from '../../shared/types/explore-filter.type';
import { GoogleBookImageLinks } from '../models/google-book-image-links.model';
import { GoogleBooksSearchResponse } from '../models/google-books-search-response.model';
import { GoogleBookVolume } from '../models/google-book-volume.model';

@Injectable({
  providedIn: 'root',
})
export class BookSearchService {
  private readonly googleBooksApiUrl =
    'https://www.googleapis.com/books/v1/volumes';
  private readonly maxResults = 20;
  private readonly maxExploreResults = 40;

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
                'A API de livros esta temporariamente limitada. Tente novamente em alguns minutos.',
              ),
          );
        }

        return throwError(
          () =>
            new Error(
              'Nao foi possivel buscar livros agora. Verifique sua conexao e tente novamente.',
            ),
        );
      }),
    );
  }

  exploreBooks(filter: ExploreFilter): Observable<Book[]> {
    const query = this.getExploreQuery(filter);

    return this.fetchGoogleVolumes(
      query,
      this.maxExploreResults,
      'relevance',
    ).pipe(
      map((volumes) => this.sortVolumesForExplore(volumes, filter)),
      map((volumes) => volumes.slice(0, this.maxResults)),
      map((volumes) => this.mapVolumesToBooks(volumes)),
      catchError((error) => {
        if (error?.status === 429 || error?.status === 403) {
          return throwError(
            () =>
              new Error(
                'A API de livros esta temporariamente limitada. Tente novamente em alguns minutos.',
              ),
          );
        }

        return throwError(
          () =>
            new Error(
              'Nao foi possivel carregar sugestoes agora. Verifique sua conexao e tente novamente.',
            ),
        );
      }),
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

  private searchGoogleBooks(query: string): Observable<Book[]> {
    return this.fetchGoogleVolumes(query, this.maxResults, 'relevance').pipe(
      map((volumes) => this.mapVolumesToBooks(volumes)),
    );
  }

  private fetchGoogleVolumes(
    query: string,
    maxResults: number,
    orderBy: 'relevance' | 'newest',
  ): Observable<GoogleBookVolume[]> {
    let params = new HttpParams()
      .set('q', query)
      .set('maxResults', maxResults.toString())
      .set('orderBy', orderBy)
      .set('printType', 'books');

    const googleBooksApiKey = environment.googleBooksApiKey.trim();

    if (googleBooksApiKey) {
      params = params.set('key', googleBooksApiKey);
    }

    return this.http
      .get<GoogleBooksSearchResponse>(this.googleBooksApiUrl, { params })
      .pipe(map((response) => response.items ?? []));
  }

  private mapVolumesToBooks(volumes: GoogleBookVolume[]): Book[] {
    return volumes
      .map((volume) => this.mapVolumeToBook(volume))
      .filter((book) => !!book.title);
  }

  private getExploreQuery(filter: ExploreFilter): string {
    if (filter === 'most-rated') {
      return 'best books';
    }

    if (filter === 'most-read') {
      return 'best seller books';
    }

    return 'book recommendations';
  }

  private sortVolumesForExplore(
    volumes: GoogleBookVolume[],
    filter: ExploreFilter,
  ): GoogleBookVolume[] {
    const sortedVolumes = [...volumes];

    if (filter === 'most-rated') {
      return sortedVolumes.sort((firstVolume, secondVolume) => {
        const ratingsCountDifference =
          this.getRatingsCount(secondVolume) -
          this.getRatingsCount(firstVolume);

        if (ratingsCountDifference !== 0) {
          return ratingsCountDifference;
        }

        return (
          this.getAverageRating(secondVolume) -
          this.getAverageRating(firstVolume)
        );
      });
    }

    if (filter === 'most-read') {
      return sortedVolumes.sort(
        (firstVolume, secondVolume) =>
          this.getPopularityScore(secondVolume) -
          this.getPopularityScore(firstVolume),
      );
    }

    return sortedVolumes;
  }

  private getRatingsCount(volume: GoogleBookVolume): number {
    return volume.volumeInfo?.ratingsCount ?? 0;
  }

  private getAverageRating(volume: GoogleBookVolume): number {
    return volume.volumeInfo?.averageRating ?? 0;
  }

  private getPopularityScore(volume: GoogleBookVolume): number {
    const ratingsCount = this.getRatingsCount(volume);
    const averageRating = this.getAverageRating(volume);

    return ratingsCount * Math.max(averageRating, 1);
  }

  private buildCoverUrl(imageLinks?: GoogleBookImageLinks): string | undefined {
    if (!imageLinks?.thumbnail && !imageLinks?.smallThumbnail) {
      return undefined;
    }

    return (imageLinks.thumbnail ?? imageLinks.smallThumbnail)?.replace(
      'http://',
      'https://',
    );
  }
}
