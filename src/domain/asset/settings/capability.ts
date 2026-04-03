import { flangeFields, FlangeSettingsField } from './flange';
import { MotorSettingsGroup } from './group';
import { motorFields, MotorSettingsField } from './motor';
import {
  blowerFields,
  chillerFields,
  compressorFields,
  fanFields,
  MotorAsSettingsField,
  motorSetFields,
  pumpFields
} from './motor-as';

export type PrimaryAssetSettingsField =
  | (MotorSettingsField & { visibleWhen?: (values: any) => boolean })
  | MotorAsSettingsField
  | FlangeSettingsField;

export const flangeSettings: PrimaryAssetSettingsField[] = flangeFields;

export const motorSettings: PrimaryAssetSettingsField[] = motorFields.map((f) => ({
  ...f,
  group: f.group ?? MotorSettingsGroup.Motor
}));

export const fanSettings = (fanFields as PrimaryAssetSettingsField[]).concat(motorSettings);

export const blowerSettings = (blowerFields as PrimaryAssetSettingsField[]).concat(motorSettings);

export const compressorSettings = (compressorFields as PrimaryAssetSettingsField[]).concat(
  motorSettings
);

export const motorSetSettings = (motorSetFields as PrimaryAssetSettingsField[]).concat(
  motorSettings
);

export const pumpSettings = (pumpFields as PrimaryAssetSettingsField[]).concat(motorSettings);

export const coolingTowerSettings = (fanFields as PrimaryAssetSettingsField[]).concat(
  motorSettings
);

export const chillerSettings = (chillerFields as PrimaryAssetSettingsField[]).concat(motorSettings);
