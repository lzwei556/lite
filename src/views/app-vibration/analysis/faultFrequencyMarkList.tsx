import React from 'react';
import { Card, List } from 'antd';
import intl from 'react-intl-universal';
import { FaultFrequency } from './useFaultFrequency';

export const FaultFrequencyMarkList = ({ faultFrequency }: { faultFrequency?: FaultFrequency }) => {
  return (
    <Card styles={{ body: { overflowY: 'auto', maxHeight: 350 } }}>
      <List
        dataSource={!faultFrequency ? [] : Object.entries(faultFrequency)}
        renderItem={([key, value]) => (
          <List.Item>
            <List.Item.Meta description={intl.get(`fault.frequency.${key}`)} />
            <span style={{ width: 90 }}>{value}</span>
          </List.Item>
        )}
      />
    </Card>
  );
};
