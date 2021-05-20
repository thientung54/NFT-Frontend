import { errorThrower } from 'lib/apiCommon';
import { Epic, combineEpics } from 'redux-observable';
import { from, of } from 'rxjs';
import { map, mergeMap, catchError, filter } from 'rxjs/operators';
import { getBMP } from 'store/getBMP';
import { BEP20Contract } from 'lib/smartContract';
import { State } from 'store';

const getBMPEpic: Epic = (action$, state$) =>
  action$.pipe(
    filter(getBMP.started.match),
    mergeMap(action => {
      const state: State = state$.value;
      return from(BEP20Contract.call('balanceOf', action.payload.account || state.common.account)).pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map(res => {
          // TODO: cập nhật lại function errorThrower (status, ...)
          console.log('amount', res);
          errorThrower(res);
          return getBMP.done({
            params: action.payload,
            result: res,
          });
        }),
        catchError(error => {
          console.log('getBMP', error);
          return of(getBMP.failed({ params: action.payload, error: error }));
        })
      );
    })
  );
export default combineEpics(getBMPEpic);
