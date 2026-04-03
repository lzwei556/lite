import React from 'react';
import { Card as AntCard, CardProps as AntCardProps } from 'antd';
import { GlobalStyle } from 'styles';

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
  const { header = {}, body = {}, ...stylesRest } = styles || {};
  const { paddingInline = GlobalStyle.BaseSpace, fontWeight = 400, ...headerStyleRest } = header;
  const headerStyles = { paddingInline, fontWeight, ...headerStyleRest };
  const { padding = GlobalStyle.BaseSpace, ...bodyStyleRest } = body;
  const bodyStyles = { padding, ...bodyStyleRest };
  return (
    <AntCard
      {...rest}
      ref={ref}
      styles={{ ...stylesRest, header: headerStyles, body: bodyStyles }}
    />
  );
});

export const Card = withStaticProps(CardComponent, {
  Grid: AntCard.Grid,
  Meta: AntCard.Meta
});

Card.Grid = AntCard.Grid;
Card.Meta = AntCard.Meta;
