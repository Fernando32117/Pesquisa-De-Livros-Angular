import { ExploreFilterOption } from '../models/explore-filter-option.model';
import { EXPLORE_FILTER_VALUES } from './explore-filter-values.constant';

export const EXPLORE_FILTER_OPTIONS: readonly ExploreFilterOption[] =
  EXPLORE_FILTER_VALUES.map((value) => {
    if (value === 'most-read') {
      return {
        value,
        label: 'Mais lidos',
        description: 'Proxy de popularidade com sinais de engajamento e avaliacao.',
      };
    }

    if (value === 'most-rated') {
      return {
        value,
        label: 'Mais avaliados',
        description: 'Livros com maior volume de avaliacoes publicas.',
      };
    }

    return {
      value,
      label: 'Relevancia',
      description: 'Livros alinhados ao tema com base em relevancia da busca.',
    };
  });
