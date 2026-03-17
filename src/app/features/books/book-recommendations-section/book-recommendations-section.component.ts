import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Book } from '../../../shared/models/book.model';
import { ExploreFilter } from '../../../types/explore-filter.type';
import { BookListComponent } from '../book-list/book-list.component';

@Component({
  selector: 'app-book-recommendations-section',
  imports: [CommonModule, BookListComponent],
  templateUrl: './book-recommendations-section.component.html',
  styleUrls: ['./book-recommendations-section.component.css'],
})
export class BookRecommendationsSectionComponent {
  @Input() selectedExploreFilter!: ExploreFilter;
  @Input() recommendedBooks: Book[] = [];
  @Input() isRecommendationsLoading = false;
  @Input() recommendationsErrorMessage = '';
  @Input() hasLoadedRecommendations = false;

  get selectedFilterLabel(): string {
    if (this.selectedExploreFilter === 'most-read') {
      return 'Mais lidos';
    }

    if (this.selectedExploreFilter === 'most-rated') {
      return 'Mais avaliados';
    }

    return 'Relevancia';
  }
}
