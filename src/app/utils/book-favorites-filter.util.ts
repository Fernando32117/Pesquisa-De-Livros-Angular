import { Book } from '../models/book.model';
import { normalizeTags } from './normalize-tags.util';
import { normalizeText } from './normalize-text.util';

export function filterFavorites(books: Book[], filter: string): Book[] {
  const normalizedFilter = normalizeText(filter.trim().toLowerCase());

  if (!normalizedFilter) {
    return [...books];
  }

  return books.filter((book) => {
    const title = normalizeText((book.title ?? '').toLowerCase());
    const normalizedTags = normalizeTags(book.tags).map((tag) =>
      normalizeText(tag.toLowerCase()),
    );

    return (
      title.includes(normalizedFilter) ||
      normalizedTags.some((tag) => tag.includes(normalizedFilter))
    );
  });
}
