import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from '../../../../models/book.model';

@Component({
  selector: 'app-favorites-grid',
  imports: [CommonModule],
  templateUrl: './favorites-grid.component.html',
  styleUrls: ['./favorites-grid.component.css'],
})
export class FavoritesGridComponent {
  @Input() favorites: Book[] = [];
  @Output() details = new EventEmitter<Book>();
  @Output() remove = new EventEmitter<string>();
  readonly fallbackImage = '/notimg.jpg';

  openDetails(book: Book): void {
    this.details.emit(book);
  }

  removeFavorite(bookId: string): void {
    this.remove.emit(bookId);
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
