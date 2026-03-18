import { Injectable } from '@angular/core';
import { ExploreFilter } from '../../types/explore-filter.type';
import { GoogleBookVolume } from '../../models/google-book-volume.model';

@Injectable({
  providedIn: 'root',
})
export class BookExploreRankingService {
  getExploreQuery(filter: ExploreFilter): string {
    if (filter === 'most-rated') {
      return 'best books';
    }

    if (filter === 'most-read') {
      return 'best seller books';
    }

    return 'book recommendations';
  }

  sortVolumesForExplore(
    volumes: GoogleBookVolume[],
    filter: ExploreFilter,
  ): GoogleBookVolume[] {
    const sortedVolumes = [...volumes];

    if (filter === 'most-rated') {
      return sortedVolumes.sort((firstVolume, secondVolume) => {
        const ratingsCountDifference =
          this.getRatingsCount(secondVolume) -
          this.getRatingsCount(firstVolume);

        if (ratingsCountDifference !== 0) {
          return ratingsCountDifference;
        }

        return (
          this.getAverageRating(secondVolume) -
          this.getAverageRating(firstVolume)
        );
      });
    }

    if (filter === 'most-read') {
      return sortedVolumes.sort(
        (firstVolume, secondVolume) =>
          this.getPopularityScore(secondVolume) -
          this.getPopularityScore(firstVolume),
      );
    }

    return sortedVolumes;
  }

  private getRatingsCount(volume: GoogleBookVolume): number {
    return volume.volumeInfo?.ratingsCount ?? 0;
  }

  private getAverageRating(volume: GoogleBookVolume): number {
    return volume.volumeInfo?.averageRating ?? 0;
  }

  private getPopularityScore(volume: GoogleBookVolume): number {
    const ratingsCount = this.getRatingsCount(volume);
    const averageRating = this.getAverageRating(volume);

    return ratingsCount * Math.max(averageRating, 1);
  }
}
