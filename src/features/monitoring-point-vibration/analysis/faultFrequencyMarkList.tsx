import React from 'react';
import { List } from 'antd';
import intl from 'react-intl-universal';
import { getValue } from '../../../utils/format';
import { FaultFrequency } from './useFaultFrequency';

export const FaultFrequencyMarkList = ({ faultFrequency }: { faultFrequency?: FaultFrequency }) => {
  return (
    <List
      style={{ overflowY: 'auto', maxHeight: 350 }}
      dataSource={!faultFrequency ? [] : Object.entries(faultFrequency)}
      renderItem={([key, value]) => (
        <List.Item>
          <List.Item.Meta description={intl.get(`fault.frequency.${key}`)} />
          <span style={{ width: 90 }}>{getValue({ value })}</span>
        </List.Item>
      )}
    />
  );
};
