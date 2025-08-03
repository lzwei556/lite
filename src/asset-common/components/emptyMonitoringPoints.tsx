import React from 'react';
import { Empty } from 'antd';
import { Card } from '../../components';
import { AssetRow } from '../types';
import { Points } from '../../monitoring-point';

export const EmptyMonitoringPoints = ({
  asset,
  children
}: {
  asset: AssetRow;
  children: React.ReactElement;
}) => {
  if (asset.monitoringPoints && Points.filter(asset.monitoringPoints).length > 0) {
    return children;
  } else {
    return (
      <Card>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );
  }
};
