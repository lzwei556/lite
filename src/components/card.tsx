import React from 'react';
import { Card as AntCard, CardProps as AntCardProps } from 'antd';
import { Space } from '../common';

export type CardProps = AntCardProps;

export const Card = (props: CardProps) => {
  const { styles, ...rest } = props;
  return (
    <AntCard
      {...rest}
      styles={{
        header: {
          minHeight: `calc(48px + 1px)`,
          padding: `0 ${Space}px`,
          fontWeight: 500,
          ...styles?.header
        },
        body: { padding: Space, ...styles?.body }
      }}
    />
  );
};

Card.Grid = AntCard.Grid;
Card.Meta = AntCard.Meta;
