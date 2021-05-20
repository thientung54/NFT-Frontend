import { errorThrower } from 'lib/apiCommon';
import { Epic, combineEpics } from 'redux-observable';
import { from, of } from 'rxjs';
import { map, mergeMap, catchError, filter } from 'rxjs/operators';
import { purchase, approveBMP, getProduct } from 'store/buyNFT';
import { BEP20Contract, SimpleExchangeContract } from 'lib/smartContract';
import axios from 'axios';
import { State } from 'store';

const approveEpic: Epic = action$ =>
  action$.pipe(
    filter(approveBMP.started.match),
    mergeMap(action => {
      return from(
        BEP20Contract.send('increaseAllowance', process.env.SIMPLE_EXCHANGE_ADDRESS, action.payload.price)
      ).pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map(res => {
          // TODO: cập nhật lại function errorThrower (status, ...)
          errorThrower(res);
          return approveBMP.done({
            params: action.payload,
            result: res,
          });
        }),
        catchError(error => of(approveBMP.failed({ params: action.payload, error: error })))
      );
    })
  );

const purchaseEpic: Epic = action$ =>
  action$.pipe(
    filter(purchase.started.match),
    mergeMap(action => {
      return from(SimpleExchangeContract.send('buyToken', action.payload.idNFT)).pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map(res => {
          // TODO: cập nhật lại function errorThrower (status, ...)
          errorThrower(res);
          return purchase.done({
            params: action.payload,
            result: res,
          });
        }),
        catchError(error => of(purchase.failed({ params: action.payload, error: error })))
      );
    })
  );

const getProductEpic: Epic = action$ =>
  action$.pipe(
    filter(getProduct.started.match),
    mergeMap(action => {
      return from(axios.get(`https://nft.techiast.com/nft/${action.payload.id}`)).pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map(res => {
          // TODO: cập nhật lại function errorThrower (status, ...)
          errorThrower(res);
          return getProduct.done({
            params: action.payload,
            result: res.data,
          });
        }),
        catchError(error => of(getProduct.failed({ params: action.payload, error: error })))
      );
    })
  );

export default combineEpics(approveEpic, purchaseEpic, getProductEpic);
