import React from 'react';
import { storiesOf } from '@storybook/react';
import { Card } from './index';

storiesOf('Components|atoms/Card', module)
  .add('BMP', () => (
    <Card id="abc" balance="123" cardType="BMP">
      Sample test
    </Card>
  ))
  .add('BNB', () => (
    <Card id="abc" balance="123" cardType="BNB">
      Sample test
    </Card>
  ));
