import React from 'react';
import { List } from 'antd';
import { Card, ChartMark } from '../../../../components';
import { useLocaleContext } from '../../../../localeProvider';
import { dispalyCoordValue, transformMarkData } from '../mark';

export const MarkList = () => {
  const { visibledMarks } = ChartMark.useContext();
  const { language } = useLocaleContext();
  return (
    <Card styles={{ body: { overflowY: 'auto', maxHeight: 350 } }}>
      <List
        dataSource={visibledMarks.map(transformMarkData)}
        renderItem={(mark) => {
          const [x, y] = mark.data;
          return (
            <List.Item>
              <List.Item.Meta description={mark.label} />
              <span style={{ width: 90 }}>X: {dispalyCoordValue(x, language)}</span>
              <span style={{ width: 90 }}>Y: {dispalyCoordValue(y, language)}</span>
            </List.Item>
          );
        }}
      />
    </Card>
  );
};
