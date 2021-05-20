import React from 'react';
import { hot } from 'react-hot-loader/root';
import { mapModifiers } from 'lib/component';
import { Text } from 'components/atoms/text';
import { formatBMPBalance, formatBNBBalance } from 'util/formatBalance';

type Modifier = '';

interface Props {
  modifiers?: Modifier | Modifier[];
  balance: number;
  id: string;
  cardType: 'BMP' | 'BNB';
}

export const Card: React.FC<Props> = props => {
  return (
    <div className={mapModifiers('a-card', props.modifiers, props.cardType === 'BMP' && 'bmp')}>
      <Text size="12">Your balance</Text>
      <Text size="18" modifiers="bold" unit={props.cardType}>
        {
          // eslint-disable-next-line no-extra-boolean-cast
          !!props.balance
            ? props.cardType === 'BNB'
              ? formatBNBBalance(props.balance)
              : formatBMPBalance(props.balance)
            : 0
        }
      </Text>
      <Text size="12">{props.id}</Text>
    </div>
  );
};

export default hot(Card);
