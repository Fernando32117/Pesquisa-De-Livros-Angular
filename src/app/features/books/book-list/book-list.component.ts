import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookStorageService } from '../../../core/services/book-storage.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { Book } from '../../../models/book.model';
import { NotificationModalComponent } from '../../../shared/components/notification-modal/notification-modal.component';
import { LoginRequiredModalComponent } from '../../../shared/components/login-required-modal/login-required-modal.component';
import { BookDetailsModalComponent } from '../book-details-modal/book-details-modal.component';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    NotificationModalComponent,
    LoginRequiredModalComponent,
    BookDetailsModalComponent,
  ],
})
export class BookListComponent {
  @Input() books: Book[] = [];
  selectedBook: Book | null = null;
  notificationMessage: string | null = null;
  showLoginModal = false;
  readonly fallbackImage = '/notimg.jpg';

  constructor(
    private bookStorage: BookStorageService,
    private authService: AuthService,
    private router: Router,
  ) {}

  openModal(book: Book): void {
    const favorite = this.bookStorage
      .getFavorites()
      .find((fav) => fav.id === book.id);

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

  async toggleFavorite(book: Book): Promise<void> {
    if (!this.authService.isAuthenticated()) {
      this.showLoginModal = true;
      return;
    }

    if (this.bookStorage.isFavorite(book.id)) {
      await this.bookStorage.removeFavorite(book.id);
    } else {
      await this.bookStorage.addFavorite(this.prepareBookForSave(book));
    }
  }

  async saveFavorite(book: Book): Promise<void> {
    if (!this.authService.isAuthenticated()) {
      this.showLoginModal = true;
      return;
    }

    await this.bookStorage.addFavorite(this.prepareBookForSave(book));
    this.closeModal();
  }

  async updateFavorite(book: Book): Promise<void> {
    await this.bookStorage.updateFavorite(this.prepareBookForSave(book));
    this.closeModal();
  }

  showNotification(message: string): void {
    this.notificationMessage = message;
    setTimeout(() => (this.notificationMessage = null), 4500);
  }

  isFavorite(book: Book): boolean {
    return this.bookStorage.isFavorite(book.id);
  }

  navigateToLogin(): void {
    this.showLoginModal = false;
    this.router.navigate(['/login']);
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
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

  private normalizeTagsForForm(tags?: string[] | string): string {
    if (!tags) {
      return '';
    }

    return Array.isArray(tags) ? tags.join(', ') : tags;
  }

  private prepareBookForSave(book: Book): Book {
    const parsedTags = this.normalizeTagsForSave(book.tags);

    return {
      ...book,
      tags: parsedTags,
      notes: book.notes ?? '',
      rating: book.rating ?? 0,
    };
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
}
