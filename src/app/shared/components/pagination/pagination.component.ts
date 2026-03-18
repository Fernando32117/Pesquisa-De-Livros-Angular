import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 0;
  @Output() pageChange = new EventEmitter<number>();

  get visiblePages(): (number | 'ellipsis')[] {
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const result: (number | 'ellipsis')[] = [1];
    const rangeStart = Math.max(2, current - 2);
    const rangeEnd = Math.min(total - 1, current + 2);

    if (rangeStart > 2) result.push('ellipsis');
    for (let i = rangeStart; i <= rangeEnd; i++) result.push(i);
    if (rangeEnd < total - 1) result.push('ellipsis');
    result.push(total);

    return result;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  isEllipsis(item: number | 'ellipsis'): boolean {
    return item === 'ellipsis';
  }

  trackByIndex(index: number): number {
    return index;
  }
}
