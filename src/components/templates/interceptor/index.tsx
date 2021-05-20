import React, { useEffect } from 'react';
import { useWallet } from 'use-wallet';
import { hot } from 'react-hot-loader/root';
import Web3 from 'web3';
import { BEP20Contract, NFTContract, SimpleExchangeContract } from 'lib/smartContract';
import { useDispatch, useSelector } from 'react-redux';
import { closeConnectModal, getCommon, setAccount } from 'store/common';
import { Button } from 'components/atoms/button';
import { Modal } from 'components/organisms/modal';
import { Text } from 'components/atoms/text';
import { connectWallet } from 'lib/apiCommon';
import { ButtonContainer } from 'components/molecules/buttonContainer';
import ReactModal from 'react-modal';

const Interceptor: React.FC = props => {
  const wallet = useWallet();
  const dispatch = useDispatch();
  const { errorMessage } = useSelector(getCommon);
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    BEP20Contract.initialize(wallet.account);
    NFTContract.initialize(wallet.account);
    SimpleExchangeContract.initialize(wallet.account);
    dispatch(setAccount({ account: wallet.account || '' }));
    errorMessage && wallet.account && dispatch(closeConnectModal());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.account]);

  useEffect(() => {
    if (window && typeof window.BinanceChain !== 'undefined') {
      window.web3 = new Web3(window.BinanceChain);
      if (sessionStorage.getItem('isConnected') === 'connected') {
        wallet.connect('injected');
      }
    } else sessionStorage.setItem('isConnected', '');
    document && ReactModal.setAppElement(document.body);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // return isLoading ? <Spinner /> : <>{props.children}</>;
  return (
    <>
      {props.children}
      <Modal
        isOpen={!!errorMessage}
        handleClose={() => {
          dispatch(closeConnectModal());
        }}
        modifiers="error"
      >
        {/* <ModalHeader handleClose={() => dispatch(closeConnectModal())} modifiers="closeonly" /> */}
        <Text modifiers={['bold', 'center']}>{errorMessage}</Text>
        <ButtonContainer>
          <Button modifiers="bid" handleClick={() => dispatch(closeConnectModal())}>
            Close
          </Button>
          <Button modifiers="buy" handleClick={() => connectWallet(wallet)}>
            Connect wallet
          </Button>
        </ButtonContainer>
      </Modal>
    </>
  );
};
export default hot(Interceptor);
