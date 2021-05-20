import React, { useState } from 'react';
import { hot } from 'react-hot-loader/root';
import Layout from 'components/templates/layout';
import { Section } from 'components/organisms/section';
import { RouteComponentProps } from '@reach/router';
import { navigate } from 'gatsby';
import { Heading } from 'components/molecules/heading';
import { TabList } from 'components/molecules/tabList';
import { TabButton } from 'components/molecules/tabButton';
import { users } from 'dummy/dummy';
import { ItemList } from 'components/organisms/itemList';
import img from 'assets/images/desert-camel.png';
import img2 from 'assets/images/image.png';
import { SearchTabType, SearchTabs } from 'components/pages/search/constant';

export const View: React.FC<RouteComponentProps> = props => {
  const query = new URLSearchParams(props.location?.search).get('query');
  if (!query) {
    typeof window !== 'undefined' && navigate('/');
    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedTab, setSelectedTab] = useState<SearchTabType>('Items');

  return (
    <div className="p-search">
      <Layout title="Search">
        <Section className="p-search_main">
          <Heading type="h1">
            Search results for <span>{query}</span>
          </Heading>
          <div className="p-search_tabs">
            <TabList>
              {SearchTabs.map(tab => (
                <TabButton key={tab} active={tab === selectedTab} handleClick={() => setSelectedTab(tab)}>
                  {tab}
                </TabButton>
              ))}
            </TabList>
          </div>
          <div className="p-search_products">
            <ItemList
              list={Array(10)
                .fill(0)
                .map((_, idx) =>
                  selectedTab === 'Items'
                    ? {
                        title: `Desert${idx}`,
                        alt: '',
                        bmp: 2000,
                        src: idx % 2 === 0 ? img : img2,
                        userList: users,
                        amount: 123,
                        id: idx,
                        bidPrice: idx % 2 === 0 ? 2000 : void 0,
                      }
                    : selectedTab === 'Users'
                    ? {
                        modifiers: 'hasavatarborder',
                        background:
                          'https://images.rarible.com/?fit=outsize&n=-1&url=https%3A%2F%2Fipfs.rarible.com%2Fipfs%2FQmTgkSn79ZeaHscoNaonT37e5dkPnDqZG3NhdLDDeEVmFw&h=220',
                        avatar:
                          'https://images.rarible.com/?fit=outsize&n=-1&url=https%3A%2F%2Fipfs.rarible.com%2Fipfs%2FQmRiXMLc7Q8fkKV7Tui1RWbv1eBWejZ7nBPHNxVvq7vFJp&w=240',
                        name: 'ARC',
                        followers: 123,
                      }
                    : {
                        modifiers: 'hasavatarborder',
                        background:
                          'https://images.rarible.com/?fit=outsize&n=-1&url=https%3A%2F%2Fipfs.rarible.com%2Fipfs%2FQmVcWKv5Dn5D2nn7ywfeaHjVmwRVE2XmELUYLzdFhkEpx2&h=220',
                        avatar:
                          'https://images.rarible.com/?fit=outsize&n=-1&url=https%3A%2F%2Fipfs.rarible.com%2Fipfs%2FQmYRsPWWXpMm3BBrpe64oG9ZePeAtGBsJgWCUC3p46BXrG&w=240',
                        name: 'FM Gallery',
                        asideInfo: idx % 2 ? 'ERC-1155' : void 0,
                        by: !(idx % 2) ? 'Sparrow' : void 0,
                      }
                )}
            />
          </div>
        </Section>
      </Layout>
    </div>
  );
};
export default hot(View);
