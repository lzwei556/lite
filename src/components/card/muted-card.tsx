import React from 'react';
import { Space } from '../../common';
import { Flex } from '../flex';
import { Card } from './card';

export const MutedCard = ({
  children,
  title,
  titleCenter = false,
  extra,
  style
}: {
  children: React.ReactNode;
  title: React.ReactNode;
  titleCenter?: boolean;
  extra?: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  let justify: React.CSSProperties['justifyContent'] = 'flex-start';
  if (titleCenter) {
    justify = 'center';
  }
  if (extra) {
    justify = 'space-between';
  }

  return (
    <Card style={style}>
      <Flex justify={justify} style={{ marginBottom: Space }}>
        <span style={{ fontSize: 16 }}>{title}</span>
        {extra}
      </Flex>
      {children}
    </Card>
  );
};
