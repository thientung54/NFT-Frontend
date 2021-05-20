import produce from 'immer';
import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';
import { getProductList, Product } from 'store/explore';

type ExploreState = {
  isLoading: boolean;
  products: Product[];
  prev_cursor?: string;
  next_cursor?: string;
  error?: any;
};

const initialValue: ExploreState = {
  isLoading: true,
  products: [],
};

const reducer: Reducer<ExploreState> = (state = initialValue, action) => {
  if (isType(action, getProductList.started)) {
    return produce(state, draft => {
      if (action.payload.mode === 'refresh') {
        draft.isLoading = true;
        draft.next_cursor = void 0;
      }
      draft.error = void 0;
    });
  }

  if (isType(action, getProductList.done)) {
    return produce(state, draft => {
      draft.isLoading = false;
      if (action.payload.params.mode === 'refresh') {
        draft.isLoading = false;
        draft.products = action.payload.result.collectibles;
      } else {
        draft.products.push(...action.payload.result.collectibles);
      }
      draft.next_cursor = action.payload.result.next_cursor;
      draft.prev_cursor = action.payload.result.prev_cursor;
    });
  }

  if (isType(action, getProductList.failed)) {
    console.log('error', action.payload.error);
    return produce(state, draft => {
      draft.products = initialValue.products;
      draft.isLoading = false;
      draft.error = action.payload.error;
    });
  }

  return state;
};

export default reducer;
