import { flangeFields, Flange } from './flange';
import { SettingsGroup } from './group';
import { motorFields, Motor } from './motor';
import {
  blowerFields,
  chillerFields,
  compressorFields,
  fanFields,
  MotorAs,
  motorSetFields,
  pumpFields
} from './motor-as';

export type Settings = (Motor & { visibleWhen?: (values: any) => boolean }) | MotorAs | Flange;

export const flangeSettings: Settings[] = flangeFields;

export const motorSettings: Settings[] = motorFields.map((f) => ({
  ...f,
  group: f.group ?? SettingsGroup.Motor
}));

export const fanSettings = (fanFields as Settings[]).concat(motorSettings);

export const blowerSettings = (blowerFields as Settings[]).concat(motorSettings);

export const compressorSettings = (compressorFields as Settings[]).concat(motorSettings);

export const motorSetSettings = (motorSetFields as Settings[]).concat(motorSettings);

export const pumpSettings = (pumpFields as Settings[]).concat(motorSettings);

export const coolingTowerSettings = (fanFields as Settings[]).concat(motorSettings);

export const chillerSettings = (chillerFields as Settings[]).concat(motorSettings);
