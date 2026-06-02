import { ColorDanger, ColorInfo, ColorWarn } from 'constants/color';
import { toSnake } from 'ts-case-convert';
import { pickOptionsFromNumericEnum, transformSnake2Dot } from 'utils';

export enum Enum {
  Minor = 1,
  Major,
  Critical
}

const PREFIX = 'alarm.level';

export const options = pickOptionsFromNumericEnum(Enum, PREFIX);

type Config = { label: string; color: string };

const table: { [Key in Enum]: Config } = {
  [Enum.Minor]: { label: 'minor', color: ColorInfo },
  [Enum.Major]: { label: 'major', color: ColorWarn },
  [Enum.Critical]: { label: 'critical', color: ColorDanger }
};

export const get = (level: Enum): Config => {
  const config = table[level];
  return { ...config, label: `${PREFIX}.${transformSnake2Dot(toSnake(config.label))}` };
};
