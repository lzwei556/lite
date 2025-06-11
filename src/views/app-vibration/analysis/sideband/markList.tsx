import React from 'react';
import { List } from 'antd';
import { Card } from '../../../../components';
import { dispalyCoordValue, transformMarkData, useMarkChartProps } from '../mark';

export const MarkList = () => {
  const { marks } = useMarkChartProps();

  return (
    <Card styles={{ body: { overflowY: 'auto', maxHeight: 350 } }}>
      <List
        dataSource={marks.map(transformMarkData)}
        renderItem={(mark) => {
          const [x, y] = mark.data;
          return (
            <List.Item>
              <List.Item.Meta description={mark.label} />
              <span style={{ width: 90 }}>X: {dispalyCoordValue(x)}</span>
              <span style={{ width: 90 }}>Y: {dispalyCoordValue(y)}</span>
            </List.Item>
          );
        }}
      />
    </Card>
  );
};
