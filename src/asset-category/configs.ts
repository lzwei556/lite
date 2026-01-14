import { toSnake } from 'ts-case-convert';
import { transformSnake2Dot } from '../utils';
import {
  blowerSettings,
  blowerType,
  chillerSettings,
  compressorSettings,
  compressorType,
  coolingTowerSettings,
  fanSettings,
  motorSetSettings,
  pumpSettings,
  pumpType,
  SettingsField
} from './settings';
import MotorSetImage from './assets/motor-set.png';
import MotorImage from './assets/motor.png';
import FanImage from './assets/fan.png';
import BlowerImage from './assets/blower.png';
import CoolingTowerImage from './assets/cooling-tower.png';
import PumpImage from './assets/pump.png';
import CompressorImage from './assets/compressor.png';
import _ from 'lodash';
import { motorFields } from './motor';
import * as Component from '../common/components';

// constants begin
export enum Value {
  Device = 100,
  WindTurbine = 101,
  Flange = 102,
  Tower = 103,
  Area = 201,
  Pipe = 221,
  Tank = 222,
  Fan = 320,
  Blower = 321,
  Compressor = 322,
  MotorGeneratorSet = 331,
  Motor = 351,
  Pump = 361,
  CoolingTower = 371,
  Chiller = 372
}

const PREFIX = 'asset.category.';

const motorSettings: (SettingsField & { group: string })[] = motorFields.map((f) => ({
  ...f,
  source: 'motor',
  group: f.group ?? `${PREFIX}${Value[Value.Motor].toLowerCase()}.parameters`
}));

const configs: Config[] = [
  { key: Value.Device, label: Value[Value.Device], labelPlural: 'asset.devices', children: [] },
  {
    key: Value.WindTurbine,
    label: Value[Value.WindTurbine],
    children: [Value.Flange, Value.Tower],
    isRoot: true
  },
  { key: Value.Flange, label: Value[Value.Flange], children: [] },
  { key: Value.Tower, label: Value[Value.Tower], children: [] },
  {
    key: Value.Area,
    label: Value[Value.Area],
    children: [
      Value.Area,
      Value.Pipe,
      Value.Tank,
      Value.Fan,
      Value.Blower,
      Value.Compressor,
      Value.MotorGeneratorSet,
      Value.Motor,
      Value.Pump,
      Value.CoolingTower,
      Value.Chiller
    ],
    isRoot: true
  },
  { key: Value.Pipe, label: Value[Value.Pipe], labelPlural: 'pipes', children: [] },
  { key: Value.Tank, label: Value[Value.Tank], labelPlural: 'tanks', children: [] },
  {
    key: Value.Fan,
    label: Value[Value.Fan],
    labelPlural: `${PREFIX}fans`,
    children: [],
    settings: fanSettings
      .map((s) => ({ ...s, group: `${PREFIX}${Value[Value.Fan].toLowerCase()}.parameters` }))
      .concat(motorSettings),
    image: FanImage
  },
  {
    key: Value.Blower,
    label: Value[Value.Blower],
    labelPlural: `${PREFIX}blowers`,
    children: [],
    settings: blowerSettings
      .map((s) => ({ ...s, group: `${PREFIX}${Value[Value.Blower].toLowerCase()}.parameters` }))
      .concat(motorSettings),
    filter: blowerType,
    image: BlowerImage
  },
  {
    key: Value.Compressor,
    label: Value[Value.Compressor],
    labelPlural: `${PREFIX}compressors`,
    children: [],
    settings: compressorSettings
      .map((s) => ({ ...s, group: `${PREFIX}${Value[Value.Compressor].toLowerCase()}.parameters` }))
      .concat(motorSettings),
    filter: compressorType,
    image: CompressorImage
  },
  {
    key: Value.MotorGeneratorSet,
    label: Value[Value.MotorGeneratorSet],
    labelPlural: `${PREFIX}motor.generator.sets`,
    children: [],
    settings: motorSetSettings
      .map((s) => ({
        ...s,
        group: `${PREFIX}${Value[Value.MotorGeneratorSet].toLowerCase()}.parameters`
      }))
      .concat(motorSettings),
    image: MotorSetImage
  },
  {
    key: Value.Motor,
    label: Value[Value.Motor],
    labelPlural: `${PREFIX}motors`,
    children: [],
    settings: motorSettings.map((s) => ({ ...s, source: '' } as SettingsField)),
    iconPath: '',
    image: MotorImage,
    componentIds: [Component.Value.MotorDriveEnd, Component.Value.MotorNonDriveEnd]
  },
  {
    key: Value.Pump,
    label: Value[Value.Pump],
    labelPlural: `${PREFIX}pumps`,
    children: [],
    settings: pumpSettings
      .map((s) => ({ ...s, group: `${PREFIX}${Value[Value.Pump].toLowerCase()}.parameters` }))
      .concat(motorSettings),
    filter: pumpType,
    image: PumpImage
  },
  {
    key: Value.CoolingTower,
    label: Value[Value.CoolingTower],
    labelPlural: `${PREFIX}cooling.towers`,
    children: [],
    settings: coolingTowerSettings
      .map((s) => ({
        ...s,
        group: `${PREFIX}${Value[Value.CoolingTower].toLowerCase()}.parameters`
      }))
      .concat(motorSettings),
    image: CoolingTowerImage
  },
  {
    key: Value.Chiller,
    label: Value[Value.Chiller],
    labelPlural: `${PREFIX}chillers`,
    children: [],
    settings: chillerSettings
      .map((s) => ({ ...s, group: `${PREFIX}${Value[Value.Chiller].toLowerCase()}.parameters` }))
      .concat(motorSettings),
    filter: compressorType,
    image: CompressorImage
  }
];
// constants end

export const Key = {
  get,
  getLabel: (key: Value) => {
    const type = get(key);
    return type ? `${PREFIX}${transformSnake2Dot(toSnake(type.label))}` : `${key}`;
  },
  getlabelPlural: (key: Value) => get(key)?.labelPlural,
  getSettings: (key: Value) => get(key)?.settings ?? [],
  getGroupedSettings: (key: Value) =>
    Object.entries(_.groupBy(Key.getSettings(key), (field) => field.group ?? '')),
  getImage: (key: Value) => get(key)?.image,
  getComponentIds: (key: Value) => get(key)?.componentIds ?? []
};

export const getNamePath = (source: SettingsField['source']) => {
  return source.length > 0 ? ['attributes', source] : ['attributes'];
};

export const vibrationAssetOptions = [
  { label: Key.getLabel(Value.Fan), type: Value.Fan },
  { label: Key.getLabel(Value.Blower), type: Value.Blower },
  { label: Key.getLabel(Value.Compressor), type: Value.Compressor },
  { label: Key.getLabel(Value.MotorGeneratorSet), type: Value.MotorGeneratorSet },
  { label: Key.getLabel(Value.Motor), type: Value.Motor },
  { label: Key.getLabel(Value.Pump), type: Value.Pump },
  { label: Key.getLabel(Value.CoolingTower), type: Value.CoolingTower },
  { label: Key.getLabel(Value.Chiller), type: Value.Chiller }
];

function get(key: Value) {
  return configs.find((type) => type.key === key) || null;
}

// types begin
type Config = {
  key: number;
  label: string;
  labelPlural?: string;
  children: number[];
  componentIds?: Component.Value[];
  isRoot?: boolean;
  settings?: SettingsField[];
  filter?: SettingsField;
  iconPath?: string;
  image?: string;
};
// types end
