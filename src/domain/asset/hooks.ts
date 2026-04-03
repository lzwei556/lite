import { AssetRow } from 'asset-common';
import { useAssetsContext } from 'providers/assets';
import { foreachTree } from 'utils/tree';

export const useAsset = (id: number): AssetRow | undefined => {
  const { assets } = useAssetsContext();
  let asset: AssetRow | undefined;
  foreachTree(assets, (_asset) => {
    if (_asset.id === id) {
      asset = _asset;
    }
  });
  return asset;
};
