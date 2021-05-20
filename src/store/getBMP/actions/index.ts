import { actionCreatorFactory } from 'typescript-fsa';
import { GetBMPReq, GetBMPRes, Error } from 'store/getBMP';

const actionCreator = actionCreatorFactory('GET_BMP');
export const getBMP = actionCreator.async<GetBMPReq, GetBMPRes, Error>('GET_BMP_BALANCE');
