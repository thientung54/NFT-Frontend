import { Asserts, boolean, object, string } from 'yup';

export const exploreSchema = object({
  filterLeaderBoardByType: string(),
  filterLeaderBoardByDate: string(),
  productCategory: string(),
  productSort: string(),
  verify: boolean(),
});

export const ProductCategories = ['Art', 'Photography', 'Game', 'Metaverses', 'Music'];

export const ExtraProductCategories = ['Domain', 'DeFi', 'Memes', 'Punks'];

type SortAndFilter = {
  filter?: 'created-date' | 'instant-sale-price';
  sort?: 'asc' | 'desc';
};

export const SortDefaultValue = 'Recently added';

export const Sort: {
  [key: string]: SortAndFilter;
} = {
  'Recently added': { filter: 'created-date', sort: 'desc' },
  Cheapest: { filter: 'instant-sale-price', sort: 'asc' },
  'Highest price': { filter: 'instant-sale-price', sort: 'desc' },
  // 'Most liked': {},
} as const;

export type ExploreSchema = Asserts<typeof exploreSchema>;
