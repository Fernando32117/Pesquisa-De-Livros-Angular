import { ExploreFilterOption } from '../../models/explore-filter-option.model';
import { ExploreFilter } from '../../types/explore-filter.type';

export const DEFAULT_EXPLORE_FILTER: ExploreFilter = 'relevance';

export const EXPLORE_FILTER_OPTIONS: readonly ExploreFilterOption[] = [
  {
    value: 'relevance',
    label: 'Relevancia',
    description: 'Livros alinhados ao tema com base em relevancia da busca.',
  },
  {
    value: 'most-read',
    label: 'Mais lidos',
    description: 'Proxy de popularidade com sinais de engajamento e avaliacao.',
  },
  {
    value: 'most-rated',
    label: 'Mais avaliados',
    description: 'Livros com maior volume de avaliacoes publicas.',
  },
];
