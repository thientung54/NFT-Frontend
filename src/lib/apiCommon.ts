/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { commonStartFailed } from 'store/common';
import { Action } from 'typescript-fsa';

export type CommonRes = { status: number };

export const errorThrower = <R extends CommonRes>(res: R) => {
  // if (res.status !== 200) {
  //   throw { error: res };
  // }
};

export const checkBinanceChain = (nextAction: Action<any>, account: string) => {
  try {
    if ((window && typeof window.BinanceChain === 'undefined') || !account) {
      throw { error: 'You should connect your wallet to sign messages and send transactions to NFT network' };
    }
    return nextAction;
  } catch (e) {
    return commonStartFailed({ error: e.error });
  }
};

export const connectWallet = (wallet: any) => {
  if (window && typeof window.BinanceChain !== 'undefined') {
    window.BinanceChain.requestAccounts().then(() => {
      wallet.connect('injected').then(() => sessionStorage.setItem('isConnected', 'connected'));
    });
  }
};
