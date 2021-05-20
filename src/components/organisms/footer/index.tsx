import React from 'react';
import { hot } from 'react-hot-loader/root';
import { mapModifiers } from 'lib/component';

type Modifier = 'foo' | 'bar';

interface Props {
  modifiers?: Modifier | Modifier[];
}

export const Footer: React.FC<Props> = props => {
  return (
    <footer className={mapModifiers('o-footer', props.modifiers)}>
      Copyright © 2021 by NFT Team. All Rights Reserved.
    </footer>
  );
};

export default hot(Footer);
