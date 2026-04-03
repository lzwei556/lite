import React from 'react';
import { Flex } from '../flex';
import { Card, CardProps } from './card';
import { GlobalStyle } from 'styles';

export const MutedCard = ({
  children,
  title,
  titleCenter = false,
  extra,
  style,
  styles
}: {
  children: React.ReactNode;
  title: React.ReactNode;
  titleCenter?: boolean;
  extra?: React.ReactNode;
  style?: React.CSSProperties;
  styles?: CardProps['styles'];
}) => {
  let justify: React.CSSProperties['justifyContent'] = 'flex-start';
  if (titleCenter) {
    justify = 'center';
  }
  if (extra) {
    justify = 'space-between';
  }

  return (
    <Card style={style} styles={styles}>
      <Flex align='center' justify={justify} style={{ marginBottom: GlobalStyle.BaseSpace }}>
        <span style={{ fontSize: 16 }}>{title}</span>
        {extra}
      </Flex>
      {children}
    </Card>
  );
};
