import React from 'react';
import { useAssetsContext } from 'providers/assets';
import { AssetRow } from 'asset-common';
import { FolderAsset } from 'domains/asset';
import * as MonitoringPointNS from 'domains/monitoring-point';

export const TreeNodeDetail = ({
  AssetFolder,
  AssetPrimary,
  MonitoringPoint
}: {
  AssetFolder: React.ComponentType<{ asset: AssetRow }>;
  AssetPrimary: React.ComponentType<{ asset: AssetRow }>;
  MonitoringPoint: React.ComponentType<{
    monitoringPoint: MonitoringPointNS.Types.Entity;
    onSuccess: (flag?: boolean | undefined) => void;
  }>;
}) => {
  const contextProps = useAssetsContext();
  const { selectedNode } = contextProps;

  if (selectedNode) {
    const { type } = selectedNode;
    if (FolderAsset.Enums.includes(type)) {
      return <AssetFolder asset={selectedNode as AssetRow} />;
    } else if (type < 10000) {
      return <AssetPrimary asset={selectedNode as AssetRow} />;
    } else {
      return (
        <MonitoringPoint
          monitoringPoint={selectedNode as MonitoringPointNS.Types.Entity}
          onSuccess={contextProps.refresh}
        />
      );
    }
  } else {
    return null;
  }
};
