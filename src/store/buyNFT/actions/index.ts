import { actionCreatorFactory } from 'typescript-fsa';
import { ApproveReq, Error, PurchaseReq, GetProductReq, GetProductRes } from 'store/buyNFT';

const actionCreator = actionCreatorFactory('BUY_NFT');

export const approveBMP = actionCreator.async<ApproveReq, any, Error>('APPROVE_BMP_URL');
export const purchase = actionCreator.async<PurchaseReq, any, Error>('PURCHASE_NFT');
export const getProduct = actionCreator.async<GetProductReq, GetProductRes, Error>('GET_PRODUCT');

export const closeModal = actionCreator('CLOSE_MODAL');
