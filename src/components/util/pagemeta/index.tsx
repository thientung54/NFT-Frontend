import React from 'react';
import { Helmet } from 'react-helmet';

interface Props {
  title: string;
}

export const Pagemeta: React.FC<Props> = ({ title }) => {
  return (
    <Helmet>
      <title>{title}</title>
      {/* <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests"></meta> */}
    </Helmet>
  );
};
