import { AssetRow } from 'asset-common';
import { useAssetsContext } from 'providers/assets';
import { useSelectedProject } from 'providers/user-profile';
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

export const useVirturalAsset = () => {
  const selectedProject = useSelectedProject();
  const root = {
    id: 0,
    type: 0,
    name: selectedProject?.name
  };
  const homePathId = `${root.id}-${root.type}`;
  return { root, homePathId };
};
