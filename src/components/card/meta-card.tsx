import React from 'react';
import { Card } from './card';
import { CardMetaProps } from 'antd/es/card';

export const MetaCard = ({ title, ...rest }: CardMetaProps) => {
  return (
    <Card className='meta-card'>
      <Card.Meta title={title} {...rest} />
    </Card>
  );
};
