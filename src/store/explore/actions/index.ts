import { actionCreatorFactory } from 'typescript-fsa';
import { GetProductListRes, GetProductListReq, Error } from 'store/explore';

const actionCreator = actionCreatorFactory('EXPLORE');
export const getProductList = actionCreator.async<GetProductListReq, GetProductListRes, Error>('GET_BMP_BALANCE');
