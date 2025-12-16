import { useAppType } from '../../config';
import { device, pipe, tank } from '../../asset-variant';
import { AssetCategory } from '../../asset-category';

export function useAssetCategories() {
  const appType = useAppType();
  switch (appType) {
    case 'corrosion':
    case 'corrosionWirelessHART':
      return [pipe, tank];
    case 'vibration':
      return AssetCategory.vibrationAssetOptions;
    default:
      return [device, pipe, tank, ...AssetCategory.vibrationAssetOptions];
  }
}
