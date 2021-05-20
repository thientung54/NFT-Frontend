import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Productcard, ProductProps } from 'components/organisms/productCard';
import { ProfileCard, ProfileProps } from 'components/organisms/profileCard';

interface Props {
  list: (ProductProps | ProfileProps)[];
}

export const ItemList: React.FC<Props> = props => {
  return (
    <div className="o-itemlist">
      {props.list.map((item, idx) => (
        <div key={idx} className="o-itemlist_item">
          {(item as ProductProps).title ? (
            <Productcard {...(item as ProductProps)}></Productcard>
          ) : (
            <ProfileCard {...(item as ProfileProps)}></ProfileCard>
          )}
        </div>
      ))}
    </div>
  );
};

export default hot(ItemList);
