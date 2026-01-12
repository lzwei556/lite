import { useAppType } from '../../config';
import { device, pipe, tank } from '../../asset-variant';
import { AssetCategory } from 'common/asset-category';

export function useAssetCategories() {
  const appType = useAppType();
  switch (appType) {
    case 'corrosion':
    case 'corrosionWirelessHART':
      return [pipe, tank];
    case 'vibration':
      return AssetCategory.Categories.getOptions(['vibration']).map((opt) => ({
        ...opt,
        type: opt.value
      }));
    default:
      return [
        device,
        pipe,
        tank,
        ...AssetCategory.Categories.getOptions(['vibration']).map((opt) => ({
          ...opt,
          type: opt.value
        }))
      ];
  }
}
