export interface Book {
  id: string;
  title: string;
  authors: string[];
  description?: string;
  publishedDate?: string;
  publisher?: string;
  thumbnail?: string;
  infoUrl?: string;
  readUrl?: string;
  buyUrl?: string;
  pdfUrl?: string;
  notes?: string;
  rating?: number;
  tags?: string[] | string;
}
