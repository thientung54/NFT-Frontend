import React, { useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { mapModifiers } from 'lib/component';
import { Button } from 'components/atoms/button';
import { Card } from 'components/atoms/card';
import { TabList } from '../tabList';
import { TabButton } from '../tabButton';

type Modifier = 'fullwidth';

interface Props {
  modifiers?: Modifier | Modifier[];
  open?: boolean;
  handleDisconnect?: () => void;
  idBNB: string;
  idBMP: string;
  balanceBNB: number;
  balanceBMP: number;
  hideDisconnect?: boolean;
}
type CardType = 'BNB' | 'BMP';

export const Mywallet: React.FC<Props> = props => {
  const [selectedCard, setSelectedCard] = useState<CardType>('BMP');
  return (
    <div className={mapModifiers('m-mywallet', props.modifiers, props.open && 'open', selectedCard)}>
      <TabList>
        {['BMP', 'BNB'].map(card => (
          <TabButton key={card} active={selectedCard === card} handleClick={() => setSelectedCard(card as CardType)}>
            {card}
          </TabButton>
        ))}
      </TabList>
      <div className="m-mywallet_cards">
        <div className="m-mywallet_cardwrapper">
          <div className="m-mywallet_card">
            {/* {selectedCard === 'BNB' ? ( */}
            <Card balance={props.balanceBMP} id={props.idBMP} cardType="BMP" />
            {/* ) : ( */}
            <Card balance={props.balanceBNB} id={props.idBNB} cardType="BNB" />
            {/* )} */}
          </div>
        </div>
      </div>
      {!props.hideDisconnect && (
        <div className="m-mywallet_disconnect">
          <Button modifiers="bid" handleClick={props.handleDisconnect}>
            Disconnect
          </Button>
        </div>
      )}
    </div>
  );
};

export default hot(Mywallet);
