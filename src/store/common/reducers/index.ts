import produce from 'immer';
import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';
import { commonStartFailed, setAccount, closeConnectModal } from 'store/common';

type Common = {
  errorMessage: string;
  account: string;
};

const initialValue: Common = { errorMessage: '', account: '' };
const reducer: Reducer<Common> = (state = initialValue, action) => {
  if (isType(action, commonStartFailed)) {
    return produce(state, draft => {
      console.log('done', action.payload.error);
      draft.errorMessage = action.payload.error;
    });
  }

  if (isType(action, setAccount)) {
    return produce(state, draft => {
      console.log('payload', action.payload.account);
      draft.account = action.payload.account;
    });
  }

  if (isType(action, closeConnectModal)) {
    return produce(state, draft => {
      draft.errorMessage = '';
    });
  }
  return state;
};

export default reducer;
