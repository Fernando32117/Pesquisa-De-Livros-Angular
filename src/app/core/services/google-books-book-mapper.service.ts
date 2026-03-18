import { Injectable } from '@angular/core';
import { Book } from '../../models/book.model';
import { GoogleBookImageLinks } from '../../models/google-book-image-links.model';
import { GoogleBookVolume } from '../../models/google-book-volume.model';

@Injectable({
  providedIn: 'root',
})
export class GoogleBooksBookMapperService {
  mapVolumesToBooks(volumes: GoogleBookVolume[]): Book[] {
    return volumes
      .map((volume) => this.mapVolumeToBook(volume))
      .filter((book) => !!book.title);
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
      'https://',
    );
  }
}
