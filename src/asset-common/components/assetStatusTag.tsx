import React from 'react';
import { Tag } from 'antd';
import { AssetStatus, getColorByValue, getLabelByValue } from '../assetStatus';
import { Translation } from 'locales/utils';

export const AssetStatusTag = ({ status }: { status: AssetStatus }) => {
  return <Tag color={getColorByValue(status)}>{Translation.get(getLabelByValue(status))}</Tag>;
};
