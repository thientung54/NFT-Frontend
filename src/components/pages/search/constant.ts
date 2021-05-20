export const SearchTabs = ['Items', 'Users', 'Collections'] as const;
export type SearchTabType = typeof SearchTabs[number];
