import { CreateForm } from 'components/pages/create/form';

export type CreateURIReq = { data?: CreateForm };

export type CreateURIRes = any;

export type CreateNFTReq = { tokenURI?: string };

export type CreateNFTRes = any;

export type ApproveReq = {
  idNFT?: number;
};

export type ApproveRes = any;

export type SellNFTReq = {};

export type SellNFTRes = any;

export type Error = any;
