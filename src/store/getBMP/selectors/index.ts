import { createSelector } from 'reselect';
import { State } from 'store';

export const getBMPStore = createSelector(
  (state: State) => state.getBMP,
  getBMP => getBMP
);
