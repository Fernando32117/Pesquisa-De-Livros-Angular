import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-favorites-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './favorites-header.component.html',
  styleUrls: ['./favorites-header.component.css'],
})
export class FavoritesHeaderComponent {
  @Input() filter = '';
  @Output() filterChange = new EventEmitter<string>();

  onFilterChange(value: string): void {
    this.filterChange.emit(value);
  }
}
