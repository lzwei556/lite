import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import { AssetRow, MonitoringPointRow } from 'asset-common';
import { FolderAsset, PrimaryAsset } from 'domain/asset';
import * as MonitoringPoint from 'domain/monitoring-point';
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
  if (FolderAsset.Enums.includes(type)) {
    return <AssetFolderIcon asset={node as AssetRow} {...rest} />;
  } else if (PrimaryAsset.Enums.includes(type)) {
    return <AssetPrimaryIcon asset={node as AssetRow} {...rest} />;
  } else if (MonitoringPoint.Type.Enums.includes(type)) {
    return <MonitoringPointIcon monitoringPoint={node as MonitoringPointRow} {...rest} />;
  } else {
    return null;
  }
};
