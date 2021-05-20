import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { Section } from 'components/organisms/section';
import { Layout } from 'components/templates/layout';
import { Dropdown } from 'components/molecules/dropdown';
import { Button } from 'components/atoms/button';
import { Icon } from 'components/atoms/icon';
import { DropdownItem, DropDownItemGroup, DropdownMenu } from 'components/molecules/dropdownMenu';
import { CheckInputFormik } from 'components/atoms/checkInput';
import { users } from 'dummy/dummy';
import { ExploreMenu } from 'components/organisms/exploreMenu';
import { TabList } from 'components/molecules/tabList';
import { TabButton } from 'components/molecules/tabButton';
import { ItemList } from 'components/organisms/itemList';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Formik } from 'formik';
import {
  ExploreSchema,
  exploreSchema,
  ExtraProductCategories,
  ProductCategories,
  Sort,
  SortDefaultValue,
} from 'components/pages/explore/form';
import { Toggle } from 'components/atoms/toggle';
import { RouteComponentProps } from '@reach/router';
import { getExploreStore, getProductList, GetProductListReq } from 'store/explore';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spinner } from 'components/atoms/spinner';
import { Text } from 'components/atoms/text';

export const Home: React.FC<RouteComponentProps> = props => {
  const params = new URLSearchParams(props.location?.search);
  // const [showUserType, setShowUserType] = useState(false);
  // const [showDateType, setShowDateType] = useState(false);
  const [showExtraCategories, setShowExtraCategories] = useState(false);
  const [showFilterAndSort, setShowFilterAndSort] = useState(false);
  const [isShowMore, setIsShowMore] = useState(false);
  const store = useSelector(getExploreStore);

  const dispatch = useDispatch();

  const getProducts = (req: GetProductListReq) => {
    dispatch(
      getProductList.started({
        limit: req.limit,
        mode: req.mode,
        filterAndSort: params.get('sort'),
        category: params.get('category'),
        cursor: req.cursor,
      })
    );
  };

  useEffect(() => {
    setIsShowMore(false);
    getProducts({
      limit: 12,
      mode: 'refresh',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialValue: ExploreSchema = useMemo(
    () => ({
      filterLeaderBoardByType: 'Sellers',
      filterLeaderBoardByDate: '1 day',
      productCategory: params.get('category') || 'All',
      productSort: params.get('sort') || SortDefaultValue,
      verify: false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleFilter = useCallback((param: string, value: string) => {
    setIsShowMore(false);
    params.get(param) ? params.set(param, value) : params.append(param, value);
    const newPath = `${props.path}?${params.toString()}`;
    window.history.pushState({ path: newPath }, '', newPath);
    getProducts({
      limit: 12,
      mode: 'refresh',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-explore">
      <Layout title="Explore">
        <Formik initialValues={initialValue} validationSchema={exploreSchema} onSubmit={() => {}}>
          {({ values }) => {
            return (
              <Form>
                {/* <Section className="p-explore_ranking">
                  <div className="p-explore_rankingfilter">
                    <Dropdown
                      trigger={
                        <Button modifiers={['asText', 'noPadding']} handleClick={() => setShowUserType(!showUserType)}>
                          <Heading>
                            Top {values.filterLeaderBoardByType} <Icon iconName="arrow-down" />
                          </Heading>
                        </Button>
                      }
                      id="usertype"
                    >
                      <DropdownMenu>
                        <DropDownItemGroup>
                          {UserTypeOptions.map(type => (
                            <DropdownItem key={type}>
                              <CheckInputFormik type="radio" name="filterLeaderBoardByType" value={type}>
                                {type}
                              </CheckInputFormik>
                            </DropdownItem>
                          ))}
                        </DropDownItemGroup>
                      </DropdownMenu>
                    </Dropdown>
                    <Dropdown
                      trigger={
                        <Button modifiers={['asText', 'noPadding']} handleClick={() => setShowDateType(!showDateType)}>
                          <Heading>
                            in {values.filterLeaderBoardByDate} <Icon iconName="arrow-down" />
                          </Heading>
                        </Button>
                      }
                      id="dateType"
                    >
                      <DropdownMenu>
                        <DropDownItemGroup>
                          {DateTypeOptions.map(type => (
                            <DropdownItem key={type}>
                              <CheckInputFormik type="radio" name="filterLeaderBoardByDate" value={type}>
                                {type}
                              </CheckInputFormik>
                            </DropdownItem>
                          ))}
                        </DropDownItemGroup>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  <div className="p-explore_leaderboard">
                    <div className="p-explore_userlist">
                      {dummyUserRankingList.map((col, idx) => (
                        <div key={idx} className="p-explore_col">
                          {col.map((user: UserRankType) => (
                            <UserRank key={user.rank} {...user} />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </Section> */}
                {/* <Section modifiers={['nobackground', 'nopadding']}> */}
                <Section className="p-explore_main">
                  <div className="p-explore_productfilter">
                    <ExploreMenu
                      category={
                        <TabList>
                          {['All', ...ProductCategories].map(cate => (
                            <TabButton
                              key={cate}
                              useFormik
                              name="productCategory"
                              value={cate}
                              handleClick={() => handleFilter('category', cate)}
                            >
                              {cate}
                            </TabButton>
                          ))}
                          <Dropdown
                            trigger={
                              <TabButton handleClick={() => setShowExtraCategories(!showExtraCategories)}>
                                &#x276F;
                              </TabButton>
                            }
                            id="productCategoryExtra"
                          >
                            <DropdownMenu>
                              <DropDownItemGroup>
                                {ExtraProductCategories.map(cate => (
                                  <DropdownItem key={cate} handleClick={() => handleFilter('category', cate)}>
                                    <CheckInputFormik type="radio" name="productCategory" value={cate}>
                                      {cate}
                                    </CheckInputFormik>
                                  </DropdownItem>
                                ))}
                              </DropDownItemGroup>
                            </DropdownMenu>
                          </Dropdown>
                        </TabList>
                      }
                      filterAndSort={
                        <Dropdown
                          trigger={
                            <Button
                              modifiers={['secondary']}
                              handleClick={() => setShowFilterAndSort(!showFilterAndSort)}
                            >
                              Filter & Sort
                            </Button>
                          }
                          id="productFilter"
                        >
                          <DropdownMenu>
                            <DropDownItemGroup groupName="Sort by">
                              {Object.keys(Sort).map((s, idx) => (
                                <DropdownItem key={idx}>
                                  <CheckInputFormik
                                    type="radio"
                                    name="productSort"
                                    value={s}
                                    handleChange={() => {
                                      handleFilter('sort', s);
                                    }}
                                  >
                                    {s}
                                  </CheckInputFormik>
                                </DropdownItem>
                              ))}
                            </DropDownItemGroup>
                            <DropDownItemGroup groupName="Options">
                              <DropdownItem>
                                <Toggle name="verify" label="Verified only" />
                              </DropdownItem>
                            </DropDownItemGroup>
                          </DropdownMenu>
                        </Dropdown>
                      }
                    />
                  </div>
                  <div className="p-explore_products">
                    {store.error ? (
                      <p className="p-explore_errormessage">{store.error.message}</p>
                    ) : (
                      <>
                        <InfiniteScroll
                          dataLength={store.products.length}
                          hasMore={isShowMore && !!store.next_cursor}
                          next={() =>
                            getProducts({
                              cursor: store.next_cursor,
                            })
                          }
                          loader={<Spinner />}
                        >
                          {store.isLoading ? (
                            <Spinner />
                          ) : store.products.length ? (
                            <ItemList
                              list={store.products.map(item => ({
                                title: item.title,
                                alt: '',
                                src: item.upload_file,
                                price: Number(item.instant_sale_price),
                                unit: item.quote_token.name,
                                mediaType: ['jpg', 'gif', 'png'].includes(
                                  new URL(item.upload_file).pathname.split('.')[1]
                                )
                                  ? 'image'
                                  : 'video',
                                userList: users,
                                amount: 0,
                                id: item.id,
                              }))}
                            />
                          ) : (
                            <div className="p-explore_noresult">
                              <Icon iconName="search-not-found" />
                              <Text size="28" modifiers={['blue']}>
                                Oops!
                              </Text>
                              <Text size="24" modifiers={['blue']}>
                                No matching search results for: {values.productCategory}.
                              </Text>
                            </div>
                          )}
                        </InfiniteScroll>
                        {!isShowMore && store.next_cursor && (
                          <Button handleClick={() => setIsShowMore(true)}>Show more</Button>
                        )}
                      </>
                    )}
                  </div>
                </Section>
              </Form>
            );
          }}
        </Formik>
      </Layout>
    </div>
  );
};

export default hot(Home);
