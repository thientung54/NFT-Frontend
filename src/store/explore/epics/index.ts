import { errorThrower } from 'lib/apiCommon';
import { Epic, combineEpics } from 'redux-observable';
import { from, of } from 'rxjs';
import { map, mergeMap, catchError, filter } from 'rxjs/operators';
import { getProductList, LIMIT_PER_PAGE } from 'store/explore';
import axios from 'axios';
import { Sort, SortDefaultValue } from 'components/pages/explore/form';

const getBMPEpic: Epic = action$ =>
  action$.pipe(
    filter(getProductList.started.match),
    mergeMap(action => {
      const params = action.payload;
      const { filter, sort } = Sort[action.payload.filterAndSort || SortDefaultValue];
      return from(
        axios.get(
          `https://nft.techiast.com/nft/collectible-paging?cursor=${params.cursor || ''}&limit=${
            params.limit || LIMIT_PER_PAGE
          }&sort=${sort}&filter=${filter}${
            (params.category && params.category !== 'All' && `&categories=${params.category.toLocaleLowerCase()}`) || ''
          }`
        )
      ).pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map(res => {
          // TODO: cập nhật lại function errorThrower (status, ...)
          console.log('amount', res.data);
          errorThrower(res);
          return getProductList.done({
            params: action.payload,
            result: res.data,
          });
        }),
        catchError(error => {
          return of(getProductList.failed({ params: action.payload, error: error }));
        })
      );
    })
  );
export default combineEpics(getBMPEpic);
