import { Book } from './book.model';

export interface BookFavoritesState {
  favorites: Book[];
  filteredFavorites: Book[];
  pagedFavorites: Book[];
  selectedBook: Book | null;
  filter: string;
  notificationMessage: string | null;
  currentPage: number;
  totalPages: number;
}
