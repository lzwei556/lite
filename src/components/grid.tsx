import React from 'react';
import { Row, RowProps } from 'antd';
import { GlobalStyle } from 'styles';

export const Grid = React.forwardRef(function Grid(
  props: RowProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { gutter = [GlobalStyle.BaseSpace, GlobalStyle.BaseSpace], ...rest } = props;
  return <Row {...rest} gutter={gutter} ref={ref} />;
});
