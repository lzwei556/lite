import { ColorDanger, ColorInfo, ColorWarn } from '../../constants/color';
import { getKeyByValue, pickOptionsFromNumericEnum } from '../../utils';

export enum AlarmLevel {
  Minor = 1,
  Major,
  Critical
}

const prefix = 'alarm.level';

export const alarmLevelOptions = pickOptionsFromNumericEnum(AlarmLevel, prefix);

export const getLabelByValue = (level: AlarmLevel) => {
  switch (level) {
    case AlarmLevel.Minor:
      return getKeyByValue(AlarmLevel, AlarmLevel.Minor, prefix);
    case AlarmLevel.Major:
      return getKeyByValue(AlarmLevel, AlarmLevel.Major, prefix);
    case AlarmLevel.Critical:
      return getKeyByValue(AlarmLevel, AlarmLevel.Critical, prefix);
  }
};

export const getColorByValue = (level: AlarmLevel) => {
  switch (level) {
    case AlarmLevel.Minor:
      return ColorInfo;
    case AlarmLevel.Major:
      return ColorWarn;
    case AlarmLevel.Critical:
      return ColorDanger;
  }
};
