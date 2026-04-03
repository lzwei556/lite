import { AssetRow, MonitoringPointRow } from 'asset-common';
import { NodeIcon } from 'features/asset-tree';
import React from 'react';
import { Icon as AssetFolderIcon } from 'asset-folder/icons';
import { Icon as AssetPrimaryIcon } from 'asset-primary/icons';
import { Icon as MonitoringPointIcon } from 'monitoring-point/icon';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

export const Icon = ({
  node,
  height = 30,
  width = 30,
  ...rest
}: Partial<CustomIconComponentProps> & { node?: AssetRow | MonitoringPointRow }) => {
  const sizeProps = { height, width };
  return (
    <NodeIcon
      node={node}
      AssetFolderIcon={AssetFolderIcon}
      AssetPrimaryIcon={AssetPrimaryIcon}
      MonitoringPointIcon={MonitoringPointIcon}
      {...sizeProps}
      {...rest}
    />
  );
};
