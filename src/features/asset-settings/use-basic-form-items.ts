import { AssetCategory } from 'common/asset-category';
import { AssetRow, useContext } from 'asset-common';
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

export const useParents = ({
  assetId,
  kind
}: {
  assetId?: number;
  kind?: AssetCategory.Value.Area | AssetCategory.Value.WindTurbine;
}) => {
  const { assets } = useContext();
  const parents: AssetRow[] = [];
  mapTree(assets, (asset) => {
    if (kind ? asset.type === kind : true) {
      parents.push(asset);
    }
  });
  return assetId ? [] : parents;
};
