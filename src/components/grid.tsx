import React from 'react';
import { Row, RowProps } from 'antd';
import { Space } from '../common';

export const Grid = (props: RowProps) => {
  const { gutter = [Space, Space], ...rest } = props;
  return <Row {...rest} gutter={gutter} />;
};
