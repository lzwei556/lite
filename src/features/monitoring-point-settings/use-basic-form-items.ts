import { AssetRow } from 'asset-common';
import { PrimaryAsset } from 'domain/asset';
import { useAssetsContext } from 'providers/assets';
import React from 'react';
import { mapTree } from 'utils/tree';

export const useType = (type?: number) => {
  const [selectedType, setSelectedType] = React.useState(type);
  return {
    disabled: !!type,
    onChange: setSelectedType,
    selectedType
  };
};

export const useAssets = ({ assetId, type }: { assetId?: number; type?: number }) => {
  const { assets } = useAssetsContext();
  const parents: AssetRow[] = [];
  mapTree(assets, (asset) => {
    if (type && PrimaryAsset.getTypesByMonitoringPointTypes([type]).includes(asset.type)) {
      parents.push(asset);
    }
  });
  return assetId ? [] : parents;
};
