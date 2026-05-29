import { ColorHealth } from '../constants/color';
import * as AlarmLevel from 'domain/alarm-level';

enum AssetSpecificStatus {
  Normal
}

export type AssetStatus = AssetSpecificStatus | AlarmLevel.Enum;

export const getLabelByValue = (status: AssetStatus) => {
  switch (status) {
    case AssetSpecificStatus.Normal:
      return 'asset.status.normal';
    default:
      return AlarmLevel.get(status).label;
  }
};

export const getColorByValue = (status: AssetStatus) => {
  switch (status) {
    case AssetSpecificStatus.Normal:
      return ColorHealth;
    default:
      return AlarmLevel.get(status).color;
  }
};
