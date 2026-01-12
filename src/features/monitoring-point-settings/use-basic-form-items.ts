import { AssetRow, useContext } from 'asset-common';
import { MonitoringPointType } from 'common';
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
  const { assets } = useContext();
  const parents: AssetRow[] = [];
  mapTree(assets, (asset) => {
    if (type && MonitoringPointType.Key.getAssetCategories(type).includes(asset.type)) {
      parents.push(asset);
    }
  });
  return assetId ? [] : parents;
};
