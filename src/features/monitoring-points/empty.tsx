import { Empty } from 'antd';
import { AssetRow } from 'asset-common';
import { Card } from 'components';
import { PrimaryAsset } from 'domain/asset';

export const EmptyMonitoringPoints = ({
  asset,
  children
}: {
  asset: AssetRow;
  children: React.ReactElement;
}) => {
  if (
    asset.monitoringPoints &&
    PrimaryAsset.Category.Flange.MonitoringPoints.filter(asset.monitoringPoints).length > 0
  ) {
    return children;
  } else {
    return (
      <Card>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );
  }
};
