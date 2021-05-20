import produce from 'immer';
import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';
import { approveBMP, closeModal, getProduct, purchase, GetProductRes } from 'store/buyNFT';

type BuyNFT = {
  isApproved: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  isGetSuccess: boolean;
  product?: GetProductRes;
};

const initialValue: BuyNFT = {
  isApproved: false,
  isSuccess: false,
  isLoading: false,
  isGetSuccess: false,
};

const reducer: Reducer<BuyNFT> = (state = initialValue, action) => {
  if (isType(action, approveBMP.started) || isType(action, purchase.started)) {
    return produce(state, draft => {
      draft.isLoading = true;
    });
  }

  if (isType(action, approveBMP.done)) {
    return produce(state, draft => {
      draft.isLoading = false;
      draft.isApproved = true;
    });
  }

  if (isType(action, purchase.done)) {
    return produce(state, draft => {
      draft.isSuccess = true;
      draft.isLoading = false;
    });
  }

  if (isType(action, closeModal)) {
    return produce(state, draft => {
      draft.isApproved = false;
    });
  }

  if (isType(action, approveBMP.failed) || isType(action, purchase.failed)) {
    return produce(state, draft => {
      console.log('error', action.payload.error);
      draft.isLoading = false;
    });
  }

  if (isType(action, getProduct.started)) {
    return produce(state, draft => {
      draft.product = undefined;
      draft.isGetSuccess = false;
      draft.isSuccess = false;
    });
  }

  if (isType(action, getProduct.done)) {
    return produce(state, draft => {
      draft.product = action.payload.result;
      draft.isGetSuccess = true;
    });
  }

  if (isType(action, getProduct.failed)) {
    return produce(state, draft => {
      //NOTE: set true here to show dump data for mock items
      console.log('error', action.payload.error);
      draft.isGetSuccess = true;
    });
  }

  return state;
};

export default reducer;
