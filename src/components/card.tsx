import React from 'react';
import { Card as AntCard, CardProps as AntCardProps } from 'antd';
import { Space } from '../common';

export type CardProps = AntCardProps;

const withStaticProps = <Props, T>(
  forwarded: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLDivElement>>,
  staticProps: T
) => Object.assign(forwarded, staticProps);

const CardComponent = React.forwardRef(function CardComponent(
  props: CardProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { styles, ...rest } = props;
  return (
    <AntCard
      {...rest}
      ref={ref}
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
});

export const Card = withStaticProps(CardComponent, {
  Grid: AntCard.Grid,
  Meta: AntCard.Meta
});

Card.Grid = AntCard.Grid;
Card.Meta = AntCard.Meta;
