import React, { useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { Heading } from 'components/molecules/heading';
import { TextFieldFormik } from 'components/atoms/textfield';
import { Button } from 'components/atoms/button';
import { Icon } from 'components/atoms/icon';
import { useWallet } from 'use-wallet';
import { Form, Formik } from 'formik';
import { navigate } from 'gatsby-link';
import { Link } from 'components/atoms/link';
import { Mywallet } from 'components/molecules/mywallet';
import { Dropdown } from 'components/molecules/dropdown';
import { connectWallet } from 'lib/apiCommon';
import { useDispatch, useSelector } from 'react-redux';
import { getBMP, getBMPStore } from 'store/getBMP';
import { throttle } from 'lodash';

const ButtonContainer: React.FC<{ wallet: any; balanceBMP: string }> = ({ wallet, balanceBMP }) => {
  const [isOpenMywallet, setIsOpenMywallet] = useState(false);

  const handleDisconnect = () => {
    if (wallet?.status === 'connected') {
      wallet.reset();
      sessionStorage.removeItem('isConnected');
    }
  };

  return (
    <div className="o-header_buttons">
      <Button anchor={{ href: '/create' }}>Create</Button>
      {wallet?.status === 'disconnected' ? (
        <Button modifiers="noBackground" handleClick={() => connectWallet(wallet)}>
          Connect wallet
        </Button>
      ) : (
        <>
          <Dropdown
            trigger={
              <Button
                modifiers={['icon', 'noBackground', 'noPadding']}
                handleClick={() => setIsOpenMywallet(!isOpenMywallet)}
              >
                <Icon iconName="wallet" />
              </Button>
            }
            id="wallet"
            offset={{ left: 105 }}
          >
            <Mywallet
              open={isOpenMywallet}
              idBNB={wallet.account}
              balanceBNB={wallet.balance}
              idBMP={wallet.account}
              balanceBMP={Number(balanceBMP)}
              handleDisconnect={handleDisconnect}
            />
          </Dropdown>
          <Button modifiers="noBackground" handleClick={handleDisconnect}>
            Disconnect
          </Button>
        </>
      )}
    </div>
  );
};

export const Header: React.FC = () => {
  const wallet = useWallet();
  const dispatch = useDispatch();
  // console.log('wallet = ', wallet);
  const [isSticky, setSticky] = useState(false);
  const [openHambugerMenu, setOpenHambugerMenu] = useState(false);

  // const getBalanceBMP = async () => {
  //   const BMPBalance = await BEP20Contract.call('balanceOf', '0x04AF59e12D4dE0A057D8E9EFAe226Ff1570b0935');
  //   console.log('BMPBalance = ', BMPBalance);

  //   // const hash = await BEP20Contract.send('transfer', '0x04AF59e12D4dE0A057D8E9EFAe226Ff1570b0935', 1000);
  //   // console.log('hash = ', hash);
  // };
  useEffect(() => {
    wallet.account && dispatch(getBMP.started({ account: wallet.account }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet?.status]);
  const { balance } = useSelector(getBMPStore);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const header = document.querySelector('.o-header');
      const layout = document.querySelector('.t-layout');
      const isSticky = (header && window.pageYOffset > header.getBoundingClientRect().top) || false;
      const onTop = window.pageYOffset === 0;
      setSticky(isSticky);
      layout?.classList.toggle('u-sticky', isSticky && !onTop);
    }, 150);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`o-header ${isSticky ? 'u-sticky' : ''}`}>
      <Heading modifiers="white">NFT</Heading>
      <div className="o-header_main">
        <Formik
          initialValues={{ search: '' }}
          onSubmit={values => {
            navigate(`/search?query=${values.search}`);
          }}
        >
          <Form className="o-header_search">
            <TextFieldFormik
              modifiers="search"
              placeholder="Search by creator, collectible or collection"
              type="text"
              name="search"
            />
          </Form>
        </Formik>
        <ul className="o-header_menu">
          <li>
            <Link href="/">Explore</Link>
          </li>
        </ul>
        <ButtonContainer wallet={wallet} balanceBMP={balance} />
        <div className="o-header_hambuger">
          <Button
            modifiers={['icon', 'noBackground', 'noBorder']}
            handleClick={() => setOpenHambugerMenu(!openHambugerMenu)}
          >
            <Icon iconName="hambuger" />
          </Button>
        </div>
      </div>
      {openHambugerMenu && (
        <div className="o-header_hambugermenu">
          <div className="o-header_head">
            <Heading modifiers="white">NFT</Heading>
            <Button
              modifiers={['icon', 'noBackground', 'noBorder']}
              handleClick={() => setOpenHambugerMenu(!openHambugerMenu)}
            >
              <Icon iconName="close" />
            </Button>
          </div>
          {wallet?.status === 'connected' && (
            <Mywallet
              open={true}
              idBNB={wallet.account || ''}
              balanceBNB={Number(wallet.balance)}
              idBMP={wallet.account || ''}
              balanceBMP={Number(balance)}
              hideDisconnect
              modifiers="fullwidth"
            />
          )}
          <ul className="o-header_menu">
            <li>
              <Link href="/">Explore</Link>
            </li>
          </ul>
          <ButtonContainer wallet={wallet} balanceBMP={balance} />
        </div>
      )}
    </header>
  );
};

export default hot(Header);
