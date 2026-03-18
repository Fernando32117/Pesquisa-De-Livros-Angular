export interface BookFavoriteRow {
  id: string;
  book_id: string;
  title: string;
  authors: string[];
  description: string | null;
  published_date: string | null;
  publisher: string | null;
  thumbnail: string | null;
  info_url: string | null;
  read_url: string | null;
  buy_url: string | null;
  pdf_url: string | null;
  notes: string | null;
  rating: number | null;
  tags: string[];
}
