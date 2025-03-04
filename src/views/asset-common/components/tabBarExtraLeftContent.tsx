import React from 'react';
import { Space } from 'antd';
import { AssetStatusTag } from '../assetStatusTag';

export const TabBarExtraLeftContent = ({
  alertLevel = 0,
  children
}: {
  alertLevel?: number;
  children: React.ReactElement;
}) => {
  return (
    <Space style={{ marginRight: 30 }} size={30}>
      {children}
      <AssetStatusTag status={alertLevel} />
    </Space>
  );
};
