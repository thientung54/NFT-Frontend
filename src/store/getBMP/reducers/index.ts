import produce from 'immer';
import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';
import { getBMP } from 'store/getBMP/actions';

type GetBMP = {
  balance: string;
};

const initialValue: GetBMP = {
  balance: '0',
};

const reducer: Reducer<GetBMP> = (state = initialValue, action) => {
  if (isType(action, getBMP.done)) {
    return produce(state, draft => {
      console.log(action.payload.result);
      draft.balance = action.payload.result;
    });
  }

  if (isType(action, getBMP.failed)) {
    return produce(state, draft => {
      console.log('error', action.payload.error);
    });
  }

  return state;
};

export default reducer;
