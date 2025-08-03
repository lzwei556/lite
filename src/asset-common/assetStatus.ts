import { ColorHealth } from '../constants/color';
import * as Alarm from '../features/alarm';

enum AssetSpecificStatus {
  Normal
}

export type AssetStatus = AssetSpecificStatus | Alarm.AlarmLevel;

export const getLabelByValue = (status: AssetStatus) => {
  switch (status) {
    case AssetSpecificStatus.Normal:
      return 'asset.status.normal';
    default:
      return Alarm.getLabelByValue(status);
  }
};

export const getColorByValue = (status: AssetStatus) => {
  switch (status) {
    case AssetSpecificStatus.Normal:
      return ColorHealth;
    default:
      return Alarm.getColorByValue(status);
  }
};
