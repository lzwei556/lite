import { Asset, AssetRow } from '../asset-common';
import DianJi from './default-image/dianji.png';
import Tank from './default-image/tank.png';
import General from './default-image/general.png';

export const getDefaultImage = (asset: AssetRow) => {
  if (Asset.Assert.isVibrationRelated(asset.type)) {
    return DianJi;
  } else if (Asset.Assert.isCorrosionRelated(asset.type)) {
    return Tank;
  } else {
    return General;
  }
};
