import React from 'react';
import { Tag } from 'antd';
import intl from 'react-intl-universal';
import { AssetStatus, getColorByValue, getLabelByValue } from '../assetStatus';

export const AssetStatusTag = ({ status }: { status: AssetStatus }) => {
  return <Tag color={getColorByValue(status)}>{intl.get(getLabelByValue(status))}</Tag>;
};
