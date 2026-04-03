import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import { AssetRow, MonitoringPointRow } from 'asset-common';
import { FolderAsset, PrimaryAssetType } from 'domain/asset';
import { OMonitoringPoint } from 'domain/monitoring-point';
import React from 'react';

type IconProps = Partial<CustomIconComponentProps>;

export const NodeIcon = ({
  node,
  AssetFolderIcon,
  AssetPrimaryIcon,
  MonitoringPointIcon,
  ...rest
}: IconProps & {
  node?: AssetRow | MonitoringPointRow;
  AssetFolderIcon: React.ComponentType<IconProps & { asset: AssetRow }>;
  AssetPrimaryIcon: React.ComponentType<IconProps & { asset: AssetRow }>;
  MonitoringPointIcon: React.ComponentType<IconProps & { monitoringPoint: MonitoringPointRow }>;
}) => {
  if (!node) return null;
  const type = node.type;
  if (FolderAsset.types.includes(type)) {
    return <AssetFolderIcon asset={node as AssetRow} {...rest} />;
  } else if (PrimaryAssetType.types.includes(type)) {
    return <AssetPrimaryIcon asset={node as AssetRow} {...rest} />;
  } else if (OMonitoringPoint.types.includes(type)) {
    return <MonitoringPointIcon monitoringPoint={node as MonitoringPointRow} {...rest} />;
  } else {
    return null;
  }
};
