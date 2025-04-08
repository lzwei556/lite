import React from 'react';
import { List } from 'antd';
import { Card, ChartMark } from '../../../../components';
import { roundValue } from '../../../../utils/format';

export const MarkList = () => {
  const { visibledMarks } = ChartMark.useContext();
  return (
    <Card styles={{ body: { overflowY: 'auto', maxHeight: 350 } }}>
      <List
        dataSource={visibledMarks}
        renderItem={(mark) => (
          <List.Item>
            <List.Item.Meta description={mark.label} />
            <span style={{ width: 90 }}>X: {mark.data[0]}</span>
            <span style={{ width: 90 }}>Y: {roundValue(mark.data[1] as number)}</span>
          </List.Item>
        )}
      />
    </Card>
  );
};
