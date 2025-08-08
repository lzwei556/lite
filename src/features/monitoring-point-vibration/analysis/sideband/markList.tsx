import React from 'react';
import { List } from 'antd';
import intl from 'react-intl-universal';
import { dispalyCoordValue, transformMarkData, useMarkChartProps } from '../mark';

export const MarkList = () => {
  const { marks } = useMarkChartProps();

  return (
    <List
      style={{ overflowY: 'auto', maxHeight: 350 }}
      dataSource={marks.map(transformMarkData)}
      renderItem={(mark) => {
        const [x, y] = mark.data;
        return (
          <List.Item>
            <List.Item.Meta description={mark.label ? intl.get(mark.label as string) : ''} />
            <span style={{ width: 90 }}>X: {dispalyCoordValue(x)}</span>
            <span style={{ width: 90 }}>Y: {dispalyCoordValue(y)}</span>
          </List.Item>
        );
      }}
    />
  );
};
