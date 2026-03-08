import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BookStorageService } from '../../../core/services/book-storage.service';
import { Book } from '../../../shared/models/book.model';

@Component({
  selector: 'app-book-favorites',
  templateUrl: './book-favorites.component.html',
  styleUrls: ['./book-favorites.component.css'],
  imports: [CommonModule, FormsModule],
})
export class BookFavoritesComponent implements OnInit, OnDestroy {
  favorites: Book[] = [];
  filteredFavorites: Book[] = [];
  selectedBook: Book | null = null;
  filter = '';
  readonly fallbackImage = '/notimg.jpg';
  private subscription: Subscription | null = null;

  notificationMessage: string | null = null;

  constructor(private bookStorage: BookStorageService) {}

  ngOnInit(): void {
    this.subscription = this.bookStorage.favorites$.subscribe(() => {
      this.favorites = this.bookStorage.getFavorites();
      this.applyFilter();
    });

    this.favorites = this.bookStorage.getFavorites();
    this.applyFilter();
  }

  removeFavorite(bookId: string): void {
    this.bookStorage.removeFavorite(bookId);
    this.showNotification('Livro removido dos favoritos!');
  }

  openModal(book: Book): void {
    const favorite = this.favorites.find((fav) => fav.id === book.id);
    const mergedBook = favorite ? { ...book, ...favorite } : { ...book };

    this.selectedBook = {
      ...mergedBook,
      notes: mergedBook.notes ?? '',
      rating: mergedBook.rating ?? 0,
      tags: this.normalizeTagsForForm(mergedBook.tags),
    };
  }

  closeModal(): void {
    this.selectedBook = null;
  }

  updateFavorite(book: Book): void {
    this.bookStorage.updateFavorite(this.prepareBookForSave(book));
    this.showNotification('Livro atualizado com sucesso!');
    this.closeModal();
  }

  applyFilter(): void {
    const normalizedFilter = this.normalizeString(this.filter.trim().toLowerCase());

    if (!normalizedFilter) {
      this.filteredFavorites = [...this.favorites];
      return;
    }

    this.filteredFavorites = this.favorites.filter((book) => {
      const title = this.normalizeString(book.title.toLowerCase());
      const normalizedTags = this.normalizeTagsForSave(book.tags).map((tag) =>
        this.normalizeString(tag.toLowerCase())
      );

      return (
        title.includes(normalizedFilter) ||
        normalizedTags.some((tag) => tag.includes(normalizedFilter))
      );
    });
  }

  private normalizeString(input: string): string {
    return input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  private normalizeTagsForForm(tags?: string[] | string): string {
    if (!tags) {
      return '';
    }

    return Array.isArray(tags) ? tags.join(', ') : tags;
  }

  private normalizeTagsForSave(tags?: string[] | string): string[] {
    if (!tags) {
      return [];
    }

    if (Array.isArray(tags)) {
      return tags.map((tag) => tag.trim()).filter(Boolean);
    }

    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  private prepareBookForSave(book: Book): Book {
    return {
      ...book,
      tags: this.normalizeTagsForSave(book.tags),
      notes: book.notes ?? '',
      rating: book.rating ?? 0,
    };
  }

  getCoverUrl(thumbnail?: string): string {
    return thumbnail || this.fallbackImage;
  }

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;

    if (image.src.endsWith(this.fallbackImage)) {
      return;
    }

    image.src = this.fallbackImage;
  }

  showNotification(message: string): void {
    this.notificationMessage = message;
    setTimeout(() => (this.notificationMessage = null), 4500);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
