import { StepIcon } from 'components/molecules/stepItem';
import produce from 'immer';
import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';
import { resetStore, createTokenURI, createNFT, approveNFT, sellNFT } from 'store/createNFT';
import { CreateForm } from 'components/pages/create/form';

type CreateNFT = {
  idNFT: number;
  tokenURI: string;
  currentStep: {
    number: number;
    status: StepIcon | 'loading';
  };
  newProduct?: CreateForm;
};

const initialValue: CreateNFT = {
  idNFT: 0,
  tokenURI: '',
  currentStep: { number: -1, status: 'loading' },
};

const reducer: Reducer<CreateNFT> = (state = initialValue, action) => {
  if (isType(action, resetStore)) {
    return produce(state, draft => {
      draft.currentStep = initialValue.currentStep;
      // NOTE: comment to test buy
      // draft.idNFT = initialValue.idNFT;
      draft.tokenURI = initialValue.tokenURI;
    });
  }

  if (isType(action, createTokenURI.started)) {
    return produce(state, draft => {
      if (draft.currentStep.status !== 'loading') draft.currentStep.status = 'loading';
      draft.currentStep.number += 1;
      if (action.payload.data) draft.newProduct = action.payload.data;
    });
  }

  if (isType(action, createNFT.started) || isType(action, approveNFT.started) || isType(action, sellNFT.started)) {
    return produce(state, draft => {
      if (draft.currentStep.status !== 'loading') draft.currentStep.status = 'loading';
    });
  }

  if (isType(action, createTokenURI.done)) {
    return produce(state, draft => {
      // draft.currentStep.number += 1;
      draft.tokenURI = action.payload.result.id;
    });
  }

  if (isType(action, createNFT.done)) {
    return produce(state, draft => {
      draft.currentStep.number += 1;
      draft.idNFT = action.payload.result.events.Transfer.returnValues.tokenId;
    });
  }

  if (isType(action, approveNFT.done) || isType(action, sellNFT.done)) {
    return produce(state, draft => {
      draft.currentStep.number += 1;
    });
  }

  if (
    isType(action, createTokenURI.failed) ||
    isType(action, createNFT.failed) ||
    isType(action, approveNFT.failed) ||
    isType(action, sellNFT.failed)
  ) {
    console.log('error', action.payload.error);
    return produce(state, draft => {
      draft.currentStep.status = 'try-again';
    });
  }

  return state;
};

export default reducer;
