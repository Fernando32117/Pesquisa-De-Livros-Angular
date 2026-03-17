import { EXPLORE_FILTER_OPTIONS } from '../constants/explore-filter.constants';
import { ExploreFilter } from '../../types/explore-filter.type';

export function isExploreFilter(value: string): value is ExploreFilter {
  return EXPLORE_FILTER_OPTIONS.some((option) => option.value === value);
}
