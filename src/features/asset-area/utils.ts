import { useAppType } from '../../config';
import { device, motor, pipe, tank } from '../../asset-variant';

export function useAssetCategories() {
  const appType = useAppType();
  switch (appType) {
    case 'corrosion':
    case 'corrosionWirelessHART':
      return [pipe, tank];
    case 'vibration':
      return [motor];
    default:
      return [device, pipe, tank, motor];
  }
}
