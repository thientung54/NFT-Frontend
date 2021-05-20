import { actionCreatorFactory } from 'typescript-fsa';
import {
  CreateURIReq,
  CreateURIRes,
  CreateNFTRes,
  CreateNFTReq,
  ApproveReq,
  ApproveRes,
  SellNFTReq,
  SellNFTRes,
  Error,
} from 'store/createNFT';

const actionCreator = actionCreatorFactory('CREATE_AND_SELL_NFT');
export const resetStore = actionCreator('RESET_START');
export const createTokenURI = actionCreator.async<CreateURIReq, CreateURIRes, Error>('CREATE_TOKEN_URL');
export const createNFT = actionCreator.async<CreateNFTReq, CreateNFTRes, Error>('CREATE_NFT');
export const approveNFT = actionCreator.async<ApproveReq, ApproveRes, Error>('APROVE_NFT');
export const sellNFT = actionCreator.async<SellNFTReq, SellNFTRes, Error>('SELL_NFT');
