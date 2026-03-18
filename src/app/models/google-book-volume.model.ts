import { GoogleBookImageLinks } from './google-book-image-links.model';

export interface GoogleBookVolume {
  id?: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    description?: string;
    publishedDate?: string;
    publisher?: string;
    averageRating?: number;
    ratingsCount?: number;
    infoLink?: string;
    canonicalVolumeLink?: string;
    imageLinks?: GoogleBookImageLinks;
  };
  accessInfo?: {
    webReaderLink?: string;
    pdf?: {
      acsTokenLink?: string;
    };
  };
  saleInfo?: {
    buyLink?: string;
  };
}
