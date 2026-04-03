import { AssetRow } from '../asset-common';
import Tank from './default-image/tank.png';
import General from './default-image/general.png';
import { PrimaryAssetType } from 'domain/asset';

export const getAssetImage = (asset: AssetRow) => {
  if (asset.image) {
    return `/images/${asset.image}`;
  } else {
    return getDefaultImage(asset);
  }
};

export const getDefaultImage = (asset: AssetRow) => {
  if (PrimaryAssetType.Category.getTypes(['vibration']).includes(asset.type)) {
    return PrimaryAssetType.getImage(asset.type) ?? General;
  } else if (PrimaryAssetType.Category.getTypes(['corrosion']).includes(asset.type)) {
    return Tank;
  } else {
    return General;
  }
};
