import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExploreFilterOption } from '../../../shared/models/explore-filter-option.model';
import { ExploreFilter } from '../../../types/explore-filter.type';

@Component({
  selector: 'app-book-discovery-panel',
  imports: [CommonModule, FormsModule],
  templateUrl: './book-discovery-panel.component.html',
  styleUrls: ['./book-discovery-panel.component.css'],
})
export class BookDiscoveryPanelComponent {
  @Input() query = '';
  @Input() selectedExploreFilter!: ExploreFilter;
  @Input() exploreFilterOptions: readonly ExploreFilterOption[] = [];
  @Output() queryChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<void>();
  @Output() filterSelect = new EventEmitter<ExploreFilter>();

  onQueryChange(value: string): void {
    this.queryChange.emit(value);
  }

  onSearch(): void {
    this.search.emit();
  }

  onFilterSelect(filter: ExploreFilter): void {
    this.filterSelect.emit(filter);
  }

  isSelectedFilter(filter: ExploreFilter): boolean {
    return this.selectedExploreFilter === filter;
  }
}
