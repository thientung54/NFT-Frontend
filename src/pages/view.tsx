import React, { useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import Layout from 'components/templates/layout';
import { Section } from 'components/organisms/section';
import { Icon } from 'components/atoms/icon';
import { Button } from 'components/atoms/button';
import { Heading } from 'components/molecules/heading';
import { Text } from 'components/atoms/text';
import { TabButton } from 'components/molecules/tabButton';
import { TabList } from 'components/molecules/tabList';
import { Tag } from 'components/atoms/tag';
import { viewInfoTab } from 'dummy/dummy';
import { RouteComponentProps } from '@reach/router';
import { navigate } from 'gatsby';

import { ViewTabItem } from 'components/molecules/viewTabItem';
import { Video } from 'components/molecules/video';
import { CheckInput } from 'components/atoms/checkInput';
import { Dropdown } from 'components/molecules/dropdown';
import { DropdownItem, DropDownItemGroup, DropdownMenu } from 'components/molecules/dropdownMenu';
import { Link } from 'components/atoms/link';
import { Modal } from 'components/organisms/modal';
import { ModalHeader } from 'components/molecules/modalHeader';
import { Form, Formik } from 'formik';
import { Icontext } from 'components/atoms/icontext';
import { Fieldrow } from 'components/molecules/fieldrow';
import { Textfield } from 'components/atoms/textfield';
import { Label } from 'components/atoms/label';
import { useDispatch, useSelector } from 'react-redux';
import { approveBMP, closeModal, getBuyStore, getProduct, purchase } from 'store/buyNFT';
import { Spinner } from 'components/atoms/spinner';
import { Toast } from 'components/molecules/toast';
import { commonStart } from 'store/common';
import { ButtonContainer } from 'components/molecules/buttonContainer';
import { formatBMPBalance } from 'util/formatBalance';
import { getBMP, getBMPStore } from 'store/getBMP';
import { amountDollar, amountDollarWithServiceFee, amountWithServiceFee } from 'util/amount';
import { Image } from 'components/atoms/image';
import { ViewTabType, ViewTabs } from 'components/pages/view/constants';

export const View: React.FC<RouteComponentProps> = props => {
  const id = new URLSearchParams(props.location?.search).get('id');
  const { isApproved, isLoading, isSuccess, product, isGetSuccess } = useSelector(getBuyStore);
  const { balance } = useSelector(getBMPStore);

  const dispatch = useDispatch();

  //TODO: call API
  const productPrice = product?.instant_sale_price || 0.5;
  const fee = (productPrice * Number(process.env.SERVICE_FEE)) / 100;
  const totalPrice: number = Number(productPrice) + fee;
  const [selectedTab, setSelectedTab] = useState<ViewTabType>('Info');
  const [like, setLike] = useState({ isLike: false, amount: 0 });

  if (!id && typeof window !== 'undefined') {
    navigate('/');
    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    dispatch(getProduct.started({ id: id! }));
  }, [dispatch, id]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    isSuccess && dispatch(getBMP.started({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return (
    <div className="p-view">
      <Layout title="View NFT">
        <Section className="p-view_main">
          {isGetSuccess ? (
            <>
              <div className="p-view_control">
                <div className="p-view_back">
                  <Button modifiers="icon" anchor={{ href: '/' }}>
                    <Icon iconName="arrow" />
                  </Button>
                </div>
                <div className="p-view_fnc">
                  <CheckInput
                    modifiers="border"
                    iconName={like.isLike ? 'heart-active' : 'heart'}
                    amount={like.amount}
                    handleChange={() =>
                      setLike({
                        isLike: !like.isLike,
                        amount: like.isLike ? like.amount - 1 : like.amount + 1,
                      })
                    }
                  />
                  <Dropdown
                    trigger={
                      <Button modifiers="icon">
                        <Icon iconName="more" />
                      </Button>
                    }
                    id="Albino Shaggy Rogers - CryptoPunk"
                  >
                    <DropdownMenu>
                      <DropDownItemGroup>
                        <DropdownItem>Place a bit</DropdownItem>
                        <DropdownItem>
                          <Link href="/#" modifiers="asText" external>
                            View on OpenSea
                          </Link>
                        </DropdownItem>
                        <DropdownItem>Share</DropdownItem>
                        <DropdownItem>Report</DropdownItem>
                      </DropDownItemGroup>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>

              <article className="p-view_product">
                <div className="p-view_item">
                  <div className="p-view_media">
                    {product &&
                      (['jpg', 'gif', 'png'].includes(new URL(product.upload_file).pathname.split('.')[1]) ? (
                        <Image src={product.upload_file} alt="" modifiers="big" />
                      ) : (
                        <Video src={product.upload_file} />
                      ))}
                  </div>
                </div>
                <div className="p-view_info">
                  <div className="p-view_detailheading">
                    <Heading type="h1" title={product?.title || 'Albino Shaggy Rogers - CryptoPunk'}>
                      {product?.title}
                    </Heading>
                    <div className="p-view_price">
                      <Text size="18" modifiers="bold" inline unit={product?.quote_token}>
                        {productPrice}
                      </Text>
                      <Text size="18" modifiers={['bold', 'gray']} inline>
                        ${amountDollar(productPrice)}
                      </Text>
                      <Text size="18" modifiers={['bold', 'gray']} inline>
                        1 of 1
                      </Text>
                    </div>
                  </div>
                  <div className="p-view_detail">
                    <div className="p-view_lead">
                      <Text modifiers="gray">
                        {product?.description || 'A new spin of CryptoPunk - Albino Shaggy Rogers'}
                      </Text>
                    </div>
                    <div className="p-view_tags">
                      {product?.categories.map(cate => (
                        <Tag key={cate}>{cate.charAt(0).toUpperCase() + cate.slice(1)}</Tag>
                      )) || <Tag>Art</Tag>}
                    </div>
                    <div className="p-view_tabs">
                      <TabList>
                        {ViewTabs.map(tab => (
                          <TabButton key={tab} active={selectedTab === tab} handleClick={() => setSelectedTab(tab)}>
                            {tab}
                          </TabButton>
                        ))}
                      </TabList>
                      <div className="p-view_tabcontent">
                        <div className="p-view_wrapper">
                          <ul>
                            {viewInfoTab[selectedTab].map((item, idx) => (
                              <li className="p-view_tabitem" key={idx}>
                                <ViewTabItem
                                  image={item.image}
                                  lead={
                                    item.userType ||
                                    (item.saleprice && (
                                      <Text size="14" modifiers="gray">
                                        {item.date ? (
                                          <>
                                            <span> Put on sale for </span>
                                            <Text size="14" modifiers="bold" inline unit={product?.quote_token}>
                                              {item.saleprice}
                                            </Text>
                                            <span> {item.date} </span>
                                          </>
                                        ) : (
                                          <>
                                            <span> Is selling for </span>
                                            <Text size="14" modifiers="bold" inline unit={product?.quote_token}>
                                              {item.saleprice}
                                            </Text>
                                          </>
                                        )}
                                      </Text>
                                    ))
                                  }
                                  by={item.by}
                                  name={item.name}
                                  hasTick={item.hasTick}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-view_buydialog">
                    <ButtonContainer>
                      <Button
                        modifiers="buy"
                        handleClick={() => {
                          dispatch(commonStart({ nextAction: approveBMP.started({ price: productPrice }) }));
                        }}
                        disabled={!product?.token_id || isSuccess}
                      >
                        {isSuccess ? 'Sold out' : 'Buy now'}
                      </Button>
                      <Button modifiers="bid">Bid</Button>
                    </ButtonContainer>
                    <p className="p-view_receipt">
                      <Text inline modifiers={['bold', 'gray']} size="14">
                        Service fee
                        <Text inline modifiers={['bold']} size="14">
                          {process.env.SERVICE_FEE}%
                        </Text>
                      </Text>
                      <Text inline modifiers={['bold', 'gray']} size="14" unit={product?.quote_token}>
                        {amountWithServiceFee(productPrice)}
                      </Text>
                      <Text inline modifiers={['bold', 'gray']} size="14">
                        ${amountDollarWithServiceFee(productPrice)}
                      </Text>
                    </p>
                  </div>
                </div>
              </article>
            </>
          ) : (
            <Spinner />
          )}
        </Section>
        <Modal isOpen={isApproved} handleClose={() => dispatch(closeModal())} modifiers="overflowy">
          {isSuccess ? (
            <Toast
              handleClose={() => {
                dispatch(closeModal());
              }}
            >
              Success purchase!
            </Toast>
          ) : (
            <>
              <ModalHeader handleClose={() => dispatch(closeModal())} title="CHECKOUT" />
              <div className="p-view_modalbody">
                <div className="p-view_balance">
                  <div className="p-view_accountinfo">
                    <Text size="18" modifiers="bold">
                      Your balance
                    </Text>
                    <div className="p-view_availablepoint">
                      <Text modifiers="bold" unit={product?.quote_token}>
                        {balance && formatBMPBalance(Number(balance))}
                      </Text>
                    </div>
                  </div>
                </div>
                <div className="p-view_modaldescription">
                  <Text>
                    You are about to purchare
                    <Text inline modifiers="bold">
                      Russian Themis
                    </Text>
                    from
                    <Text inline modifiers="bold">
                      Xtantin4
                    </Text>
                  </Text>
                  <Icontext iconName="coin">
                    <Text modifiers={['bold', 'blue']} unit={product?.quote_token}>
                      {productPrice}
                    </Text>
                  </Icontext>
                </div>
                <Formik initialValues={{ quantity: 1 }} onSubmit={() => {}}>
                  {({ values }) => {
                    return (
                      <Form className="p-view_modalform">
                        <Fieldrow fieldName="Quantity">
                          <Textfield name="quantity" placeholder="1" useFormik readonly />
                        </Fieldrow>
                        <div className="p-view_modalreceipt">
                          <Label>You will pay</Label>
                          <div className="p-view_totalpay">
                            <Text size="14">Total</Text>
                            <Text size="14" unit={product?.quote_token}>
                              {totalPrice}
                            </Text>
                          </div>
                          <ul className="p-view_receiptdetail">
                            <li>
                              - Product:
                              <Text unit={product?.quote_token} size="14" inline>
                                {productPrice}
                              </Text>
                            </li>
                            <li>
                              - Fee:
                              <Text unit={product?.quote_token} size="14" inline>
                                {fee}
                              </Text>
                            </li>
                          </ul>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
                {totalPrice > Number(balance) && (
                  <p className="p-view_errormessage">You don't have enough money to buy it.</p>
                )}

                <ButtonContainer>
                  <Button modifiers="bid" handleClick={() => dispatch(closeModal())}>
                    Cancel
                  </Button>
                  <Button
                    modifiers="buy"
                    disabled={totalPrice > Number(balance)}
                    handleClick={() => {
                      // dispatch(commonStart({ nextAction: purchase.started({ idNFT: 32 }) }));
                      dispatch(commonStart({ nextAction: purchase.started({ idNFT: product?.token_id }) }));
                    }}
                  >
                    Payment
                  </Button>
                </ButtonContainer>
              </div>
            </>
          )}
        </Modal>
      </Layout>
      {isLoading && <Spinner modifiers="screen" label="Processing" />}
    </div>
  );
};
export default hot(View);
