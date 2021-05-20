import React, { useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { Layout } from 'components/templates/layout';
import { Section } from 'components/organisms/section';
import { Form, Formik } from 'formik';
import { Categories, createSchema, initialValue, Unit } from 'components/pages/create/form';
import { Heading } from 'components/molecules/heading';
import { Fieldrow } from 'components/molecules/fieldrow';
import { TextFieldFormik } from 'components/atoms/textfield';
import { FileInput } from 'components/atoms/fileinput';
import { Textarea } from 'components/atoms/textarea';
import { Button } from 'components/atoms/button';
import { Productcard } from 'components/organisms/productCard';
import { navigate } from 'gatsby-link';
import { Collection } from 'components/molecules/collection';
import { Modal } from 'components/organisms/modal';
import { ModalHeader } from 'components/molecules/modalHeader';
import { StepItem } from 'components/molecules/stepItem';
import { Steps } from 'components/organisms/steps';
import { useWallet } from 'use-wallet';
import { useDispatch, useSelector } from 'react-redux';
import { approveNFT, createNFT, createTokenURI, getCreateStore, resetStore, sellNFT } from 'store/createNFT';
import { Select } from 'components/atoms/select';
import { commonStart } from 'store/common';
import { ButtonContainer } from 'components/molecules/buttonContainer';
import { amountReceived, amountReceivedDollar } from 'util/amount';
import { MultiSelect } from 'components/atoms/multiselect';

export const Create: React.FC = () => {
  const wallet = useWallet();
  const dispatch = useDispatch();
  const { currentStep, tokenURI } = useSelector(getCreateStore);

  const serviceFee = Number(process.env.SERVICE_FEE);

  const CreateSteps = [
    {
      description: 'Call contract method',
      title: 'Upload files and Mint tocken',
      handleClick: () => {
        dispatch(tokenURI ? createNFT.started({}) : createTokenURI.started({}));
      },
    },
    {
      description: 'Approve perfoming transactions with your wallet',
      title: 'Approve',
      handleClick: () => {
        dispatch(approveNFT.started({}));
      },
    },
    {
      description: 'Sign sell order using your wallet',
      title: 'Sign sell order',
      handleClick: () => {
        dispatch(sellNFT.started({}));
      },
    },
  ];

  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    currentStep.number === CreateSteps.length &&
      setTimeout(() => {
        setModalOpen(false);
      }, 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep.number]);

  useEffect(() => {
    if (!modalOpen) {
      dispatch(resetStore());
      currentStep.number === CreateSteps.length && navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, modalOpen]);

  return (
    <div className="p-create">
      <Layout title="Create NFT">
        <Section className="p-create_main">
          <Heading>Create collectible</Heading>
          <Formik
            initialValues={initialValue}
            validationSchema={createSchema}
            onSubmit={values => {
              dispatch(commonStart({ nextAction: createTokenURI.started({ data: values }) }));
              setModalOpen(!!wallet.account);
            }}
            validateOnMount
          >
            {({ values, isValid, setTouched, touched }) => {
              const previewSrc = URL && values.file ? URL.createObjectURL(values.file) : '';
              const previewType = values.file && values.file.type;
              return (
                <Form className="p-create_form">
                  <div className="p-create_inputs">
                    <Fieldrow fieldName="Upload file" name="file">
                      <FileInput
                        name="file"
                        label="PNG, GIF, WEBP, MP4 or MP3. Max 50mb. "
                        setTouched={() => !touched.file && setTouched({ ...touched, file: true })}
                      />
                    </Fieldrow>
                    {/* <Fieldrow
                        fieldName="Put on sale"
                        caption="You’ll receive bids on this item"
                        toggleName="onsale"
                      /> */}
                    {/* {values.onsale && ( */}
                    <Fieldrow
                      className="p-create_instantsale"
                      fieldName="Instant sale price"
                      lead="Enter the price for which the item will be instantly sold"
                      // toggleName="instantsale"
                      caption={[
                        `Service fee ${serviceFee}%`,
                        `You will receive ${amountReceived(values.instantsaleprice)}${
                          values.unit
                        } $${amountReceivedDollar(values.instantsaleprice)}`,
                      ]}
                      isCaptionForInput
                      name="instantsaleprice"
                    >
                      {/* {values.instantsale && ( */}
                      <TextFieldFormik name="instantsaleprice" placeholder="Enter price for one piece" type="number" />
                      <Select name="unit">
                        {Unit.map(u => (
                          <option value={u} key={u}>
                            {u}
                          </option>
                        ))}
                      </Select>
                      {/* )} */}
                    </Fieldrow>
                    {/* )} */}
                    {/* <Fieldrow
                      fieldName="Unlock once purchased"
                      lead="Content will be unlocked after successful transaction"
                      toggleName="unlockonbuy"
                      caption={values.unlockonbuy ? '＊ Markdown syntax is supported' : ''}
                    >
                      {values.unlockonbuy && (
                        <Textarea name="lockedcontent" placeholder="Digital key, code to reedem or link to a file..." />
                      )}
                    </Fieldrow> */}
                    {/* <Fieldrow fieldName="Choose collection" name="collection">
                      <div className="p-create_collections">
                        <button className="p-create_addcollection" type="button">
                          <span>+</span>
                          <span>Create</span>
                        </button>
                        <Collection
                          name="collection"
                          value="NFT"
                          src="https://images.rarible.com/?fit=outsize&n=-1&url=https%3A%2F%2Fipfs.rarible.com%2Fipfs%2FQmfNA7QWXzSp5G7qwkR9DxR225AGbtxjtfGDKrX2s9TV2N&w=100"
                        />
                        <Collection
                          name="collection"
                          value="Rarible"
                          src="https://images.rarible.com/?fit=outsize&n=-1&url=https%3A%2F%2Fipfs.rarible.com%2Fipfs%2FQmfNA7QWXzSp5G7qwkR9DxR225AGbtxjtfGDKrX2s9TV2N&w=100"
                        />
                      </div>
                    </Fieldrow> */}

                    <Fieldrow fieldName="Category" name="categories">
                      {/* <Select name="category">
                        {[...ProductCategories, ...ExtraProductCategories].map((category, idx) => (
                          <option key={idx} value={category}>
                            {category}
                          </option>
                        ))}
                      </Select> */}
                      {typeof window !== `undefined` && (
                        <MultiSelect
                          options={Categories}
                          selectedValues={values.categories}
                          name="categories"
                          onBlur={() => !touched.categories && setTouched({ ...touched, categories: true })}
                        />
                      )}
                    </Fieldrow>

                    <Fieldrow fieldName="Name" name="name">
                      <TextFieldFormik name="name" placeholder="Redeemable T-shirt with logo" />
                    </Fieldrow>
                    <Fieldrow fieldName="Description" isOptional className="p-create_description">
                      <Textarea name="description" placeholder="Redeemable T-shirt with logo" maxLength={500} />
                    </Fieldrow>
                    {/* <Fieldrow fieldName="Royalties" caption="＊ Suggested: 10%, 20%, 30%" name="royalties">
                      <TextFieldFormik name="royalties" placeholder="10" unit="%" />
                    </Fieldrow>
                    <Fieldrow fieldName="Properties" isOptional>
                      <TextFieldFormik name="size" placeholder="size" />
                      <TextFieldFormik name="code" placeholder="M" />
                    </Fieldrow> */}
                    <ButtonContainer>
                      <Button type="button" modifiers="bid" anchor={{ href: '/' }}>
                        Back
                      </Button>
                      <Button type="submit" modifiers="buy" disabled={!isValid}>
                        Create
                      </Button>
                    </ButtonContainer>
                  </div>
                  <div className="p-create_review">
                    <div className="p-create_reviewbox">
                      <Productcard
                        title={values.name || ''}
                        price={values.instantsaleprice || 0}
                        unit={values.unit}
                        src={previewSrc}
                        mediaType={previewType}
                        // collection={values.collection}
                        alt=""
                        isPreview
                      />
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Section>
        <Modal isOpen={modalOpen} handleClose={() => setModalOpen(false)}>
          <ModalHeader title="FOLLOW STEPS" handleClose={() => setModalOpen(false)} />
          <Steps>
            {CreateSteps.map((step, idx) => {
              const iconName =
                currentStep.number > idx
                  ? 'tick-success'
                  : currentStep.number === idx
                  ? currentStep.status
                  : 'tick-step';
              return <StepItem key={idx} iconName={iconName} {...step} handleClick={step.handleClick} />;
            })}
          </Steps>
        </Modal>
      </Layout>
    </div>
  );
};

export default hot(Create);
