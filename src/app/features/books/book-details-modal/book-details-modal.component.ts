import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from '../../../models/book.model';

@Component({
  selector: 'app-book-details-modal',
  imports: [CommonModule],
  templateUrl: './book-details-modal.component.html',
  styleUrls: ['./book-details-modal.component.css'],
})
export class BookDetailsModalComponent {
  @Input() book: Book | null = null;
  @Input() fallbackImage = '/notimg.jpg';
  @Input() showPrimaryAction = true;
  @Input() primaryActionLabel = 'Adicionar aos Favoritos';
  @Output() close = new EventEmitter<void>();
  @Output() saveFavorite = new EventEmitter<Book>();

  closeModal(): void {
    this.close.emit();
  }

  onSaveFavorite(): void {
    if (!this.book) {
      return;
    }

    this.saveFavorite.emit(this.book);
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
}
