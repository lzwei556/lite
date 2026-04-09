import { AssetRow } from 'asset-common';
import React from 'react';
import { mapTree } from 'utils/tree';
import { useAssetsContext } from 'providers/assets';
import { FolderAsset } from 'domain/asset';

export const useType = (type?: number) => {
  const [selectedType, setSelectedType] = React.useState(type);
  return {
    disabled: !!type,
    onChange: setSelectedType,
    selectedType
  };
};

export const useParents = ({ assetId, type }: { assetId?: number; type?: number }) => {
  const { assets } = useAssetsContext();
  const parents: AssetRow[] = [];
  mapTree(assets, (asset) => {
    if (type && FolderAsset.Enums.includes(asset.type)) {
      parents.push(asset);
    }
  });
  return assetId ? [] : parents;
};
