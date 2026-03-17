import { GoogleBooksOrderBy } from '../../types/google-books-order-by.type';

export interface GoogleBooksSearchRequest {
  query: string;
  maxResults: number;
  orderBy: GoogleBooksOrderBy;
}
