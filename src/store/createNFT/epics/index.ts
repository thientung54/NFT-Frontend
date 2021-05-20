import { Epic, combineEpics } from 'redux-observable';
import { from, of } from 'rxjs';
import { map, mergeMap, catchError, filter } from 'rxjs/operators';
import { createTokenURI, createNFT, approveNFT, sellNFT } from 'store/createNFT';
import { State } from 'store';
import { NFTContract, SimpleExchangeContract } from 'lib/smartContract';
import { errorThrower } from 'lib/apiCommon';
import axios from 'axios';
import { formatSaleBalance } from 'util/formatBalance';

const createURIEpic: Epic = (action$, state$) =>
  action$.pipe(
    filter(createTokenURI.started.match),
    mergeMap(action => {
      const state: State = state$.value;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const values = action.payload.data || state.createNFT.newProduct!;
      const data = new FormData();
      data.append('title', values.name);
      data.append('description', values.description || '');
      // data.append('royalty_percent', `${values.royalties}`);
      // data.append('unlock_once_purchased', `${values.unlockonbuy}`);
      data.append('instant_sale_price', `${values.instantsaleprice}`);
      data.append('upload_file', values.file);
      data.append('quote_token', values.unit);
      values.categories?.map(cate => data.append('categories', cate.name.toLocaleLowerCase()));

      return from(
        axios.post('https://nft.techiast.com/nft', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      ).pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mergeMap(res => {
          errorThrower(res);
          console.log('createTokenURI', res);
          return of(
            createTokenURI.done({
              params: action.payload,
              result: res.data,
            }),
            createNFT.started({ tokenURI: res.data.id })
          );
        }),
        catchError(error => of(createTokenURI.failed({ params: action.payload, error: error })))
      );
    })
  );

// const createNFTEpic: Epic = (action$, state$) =>
//   action$.pipe(
//     filter(createNFT.started.match),
//     mergeMap(action => {
//       const store: State = state$.value;
//       return from(NFTContract.send('create', store.common.account, store.createNFT.tokenURI)).pipe(
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         mergeMap((res: any) => {
//           // TODO: cập nhật lại function errorThrower (status, ...)
//           errorThrower(res);
//           console.log(res);
//           // debugger;
//           return of(
//             createNFT.done({
//               params: action.payload,
//               result: res,
//             }),
//             approveNFT.started({ idNFT: res.events.Transfer.returnValues.tokenId })
//           );
//         }),
//         catchError(error => of(createNFT.failed({ params: action.payload, error: error })))
//       );
//     })
//   );

const createNFTEpic: Epic = (action$, store$) =>
  action$.pipe(
    filter(createNFT.started.match),
    mergeMap(action => {
      const store: State = store$.value;
      return from(
        NFTContract.send('create', store.common.account, action.payload.tokenURI || store.createNFT.tokenURI)
      ).pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mergeMap((res: any) => {
          // TODO: cập nhật lại function errorThrower (status, ...)
          errorThrower(res);
          console.log(res.data);
          return of(
            createNFT.done({
              params: action.payload,
              result: res,
            }),
            approveNFT.started({ idNFT: res.events.Transfer.returnValues.tokenId })
          );
        }),
        catchError(error => {
          console.log(error);
          return of(createNFT.failed({ params: action.payload, error: error }));
        })
      );
    })
  );

const approveNFTEpic: Epic = (action$, state$) =>
  action$.pipe(
    filter(approveNFT.started.match),
    mergeMap(action => {
      const store: State = state$.value;
      return from(
        NFTContract.send('approve', process.env.SIMPLE_EXCHANGE_ADDRESS, action.payload.idNFT || store.createNFT.idNFT)
      ).pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mergeMap((res: any) => {
          // TODO: cập nhật lại function errorThrower (status, ...)
          errorThrower(res);
          console.log('approveNFT', res);

          return of(
            approveNFT.done({
              params: action.payload,
              result: res,
            }),
            sellNFT.started({})
          );
        }),
        catchError(error => of(approveNFT.failed({ params: action.payload, error: error })))
      );
    })
  );

const sellNFTEpic: Epic = (action$, state$) =>
  action$.pipe(
    filter(sellNFT.started.match),
    mergeMap(action => {
      const store: State = state$.value;
      return from(
        SimpleExchangeContract.send(
          'sellToken',
          store.createNFT.idNFT,
          formatSaleBalance(store.createNFT.newProduct?.instantsaleprice || 1000)
        )
      ).pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((res: any) => {
          // TODO: cập nhật lại function errorThrower (status, ...)
          errorThrower(res);
          console.log('sellNFT', res);

          return sellNFT.done({
            params: action.payload,
            result: res,
          });
        }),
        catchError(error => {
          console.log(error);
          return of(sellNFT.failed({ params: action.payload, error: error }));
        })
      );
    })
  );

export default combineEpics(createURIEpic, createNFTEpic, approveNFTEpic, sellNFTEpic);
