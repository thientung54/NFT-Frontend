import { actionCreatorFactory, Action } from 'typescript-fsa';

const actionCreator = actionCreatorFactory('test');
export const commonStart = actionCreator<{ nextAction: Action<any> }>('COMMON_START');
export const commonStartFailed = actionCreator<{ error: string }>('COMMON_START_FAILED');
export const setAccount = actionCreator<{ account: string }>('SET_ACCOUNT');
export const closeConnectModal = actionCreator('CLOSE_CONNECT_MODAL');
