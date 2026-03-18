import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Book } from '../../models/book.model';
import { BookFavoriteRow } from '../../models/book-favorite-row.model';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class BookStorageService {
  private favorites: Book[] = [];
  private favoritesSubject = new BehaviorSubject<Book[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  private notificationSubject = new BehaviorSubject<string | null>(null);
  notification$ = this.notificationSubject.asObservable();

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService,
  ) {
    if (this.supabaseService.isBrowser) {
      // Recarregar favoritos quando o auth mudar
      this.authService.authenticated$.subscribe((isAuth) => {
        if (isAuth) {
          this.loadFavorites();
        } else {
          this.favorites = [];
          this.favoritesSubject.next([]);
        }
      });
    }
  }

  getFavorites(): Book[] {
    return this.favorites;
  }

  async addFavorite(book: Book): Promise<void> {
    const userId = this.authService.getUserId();
    if (!userId) return;

    const normalizedBook = this.normalizeBook(book);

    if (this.isFavorite(normalizedBook.id)) return;

    const { error } = await this.supabaseService.client
      .from('book_favorites')
      .insert(this.toRow(userId, normalizedBook));

    if (error) {
      this.showNotification('Erro ao favoritar o livro.');
      return;
    }

    this.favorites = [...this.favorites, normalizedBook];
    this.favoritesSubject.next(this.favorites);
    this.showNotification('Livro favoritado com sucesso!');
  }

  async updateFavorite(book: Book): Promise<void> {
    const userId = this.authService.getUserId();
    if (!userId) return;

    const normalizedBook = this.normalizeBook(book);

    const { error } = await this.supabaseService.client
      .from('book_favorites')
      .update({
        notes: normalizedBook.notes ?? '',
        rating: normalizedBook.rating ?? 0,
        tags: this.normalizeTagsArray(normalizedBook.tags),
      })
      .eq('user_id', userId)
      .eq('book_id', normalizedBook.id);

    if (error) {
      this.showNotification('Erro ao editar o livro.');
      return;
    }

    this.favorites = this.favorites.map((currentBook) =>
      currentBook.id === normalizedBook.id ? normalizedBook : currentBook,
    );
    this.favoritesSubject.next(this.favorites);
    this.showNotification('Livro editado com sucesso!');
  }

  async removeFavorite(bookId: string): Promise<void> {
    const userId = this.authService.getUserId();
    if (!userId) return;

    const { error } = await this.supabaseService.client
      .from('book_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('book_id', bookId);

    if (error) {
      this.showNotification('Erro ao remover o livro.');
      return;
    }

    this.favorites = this.favorites.filter((book) => book.id !== bookId);
    this.favoritesSubject.next(this.favorites);
    this.showNotification('Livro removido dos favoritos com sucesso!');
  }

  isFavorite(bookId: string): boolean {
    return this.favorites.some((book) => book.id === bookId);
  }

  private async loadFavorites(): Promise<void> {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.favorites = [];
      this.favoritesSubject.next([]);
      return;
    }

    const { data, error } = await this.supabaseService.client
      .from('book_favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      this.favorites = [];
      this.favoritesSubject.next([]);
      return;
    }

    this.favorites = (data as BookFavoriteRow[]).map((row) =>
      this.fromRow(row),
    );
    this.favoritesSubject.next(this.favorites);
  }

  private toRow(userId: string, book: Book): Record<string, unknown> {
    return {
      user_id: userId,
      book_id: book.id,
      title: book.title,
      authors: Array.isArray(book.authors)
        ? book.authors
        : [String(book.authors)],
      description: book.description ?? null,
      published_date: book.publishedDate ?? null,
      publisher: book.publisher ?? null,
      thumbnail: book.thumbnail ?? null,
      info_url: book.infoUrl ?? null,
      read_url: book.readUrl ?? null,
      buy_url: book.buyUrl ?? null,
      pdf_url: book.pdfUrl ?? null,
      notes: book.notes ?? '',
      rating: book.rating ?? 0,
      tags: this.normalizeTagsArray(book.tags),
    };
  }

  private fromRow(row: BookFavoriteRow): Book {
    return {
      id: row.book_id,
      title: row.title,
      authors: row.authors ?? ['Autor desconhecido'],
      description: row.description ?? undefined,
      publishedDate: row.published_date ?? undefined,
      publisher: row.publisher ?? undefined,
      thumbnail: row.thumbnail ?? undefined,
      infoUrl: row.info_url ?? undefined,
      readUrl: row.read_url ?? undefined,
      buyUrl: row.buy_url ?? undefined,
      pdfUrl: row.pdf_url ?? undefined,
      notes: row.notes ?? '',
      rating: row.rating ?? 0,
      tags: row.tags ?? [],
    };
  }

  normalizeBook(rawBook: any): Book {
    const legacyVolumeInfo = rawBook?.volumeInfo ?? {};
    const legacyAccessInfo = rawBook?.accessInfo ?? {};
    const legacySaleInfo = rawBook?.saleInfo ?? {};

    const title = rawBook?.title ?? legacyVolumeInfo?.title ?? 'Sem titulo';
    const id = String(
      rawBook?.id ??
        rawBook?.key ??
        legacyVolumeInfo?.canonicalVolumeLink ??
        `${title}-${legacyVolumeInfo?.publishedDate ?? 'unknown'}`,
    );

    const authors = rawBook?.authors ??
      legacyVolumeInfo?.authors ??
      (rawBook?.author_name as string[] | undefined) ?? ['Autor desconhecido'];

    return {
      id,
      title,
      authors: Array.isArray(authors) ? authors : [String(authors)],
      description: rawBook?.description ?? legacyVolumeInfo?.description,
      publishedDate: rawBook?.publishedDate ?? legacyVolumeInfo?.publishedDate,
      publisher: rawBook?.publisher ?? legacyVolumeInfo?.publisher,
      thumbnail: rawBook?.thumbnail ?? legacyVolumeInfo?.imageLinks?.thumbnail,
      infoUrl: rawBook?.infoUrl ?? legacyVolumeInfo?.infoLink,
      readUrl:
        rawBook?.readUrl ??
        legacyAccessInfo?.webReaderLink ??
        rawBook?.infoUrl ??
        legacyVolumeInfo?.infoLink,
      buyUrl: rawBook?.buyUrl ?? legacySaleInfo?.buyLink,
      pdfUrl: rawBook?.pdfUrl ?? legacyAccessInfo?.pdf?.acsTokenLink,
      notes: rawBook?.notes ?? '',
      rating: Number(rawBook?.rating ?? 0),
      tags: this.normalizeTagsArray(rawBook?.tags),
    };
  }

  private normalizeTagsArray(tags: string[] | string | undefined): string[] {
    if (!tags) return [];
    if (Array.isArray(tags))
      return tags.map((tag) => tag.trim()).filter(Boolean);
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  private showNotification(message: string): void {
    this.notificationSubject.next(message);
    setTimeout(() => {
      this.notificationSubject.next(null);
    }, 3000);
  }
}
