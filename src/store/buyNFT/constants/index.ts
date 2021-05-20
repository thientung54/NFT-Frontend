import { Product } from 'store/explore';

export type Error = any;

export type ApproveReq = {
  price: number;
};

export type PurchaseReq = {
  idNFT?: number;
};

export type GetProductReq = {
  id: string;
};

export type GetProductRes = Omit<Product, 'quote_token'> & {
  quote_token: string;
};
