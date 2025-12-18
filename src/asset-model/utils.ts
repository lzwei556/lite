import { Asset, AssetRow } from '../asset-common';
import Tank from './default-image/tank.png';
import General from './default-image/general.png';
import { AssetCategory } from '../asset-category';

export const getAssetImage = (asset: AssetRow) => {
  if (asset.image) {
    return `/images/${asset.image}`;
  } else {
    return getDefaultImage(asset);
  }
};

export const getDefaultImage = (asset: AssetRow) => {
  if (Asset.Assert.isVibrationRelated(asset.type)) {
    return AssetCategory.Key.getImage(asset.type) ?? General;
  } else if (Asset.Assert.isCorrosionRelated(asset.type)) {
    return Tank;
  } else {
    return General;
  }
};
