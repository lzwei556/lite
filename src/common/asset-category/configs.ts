import { toSnake } from 'ts-case-convert';
import { transformSnake2Dot } from 'utils';
import {
  blowerSettings,
  blowerType,
  chillerSettings,
  compressorSettings,
  compressorType,
  coolingTowerSettings,
  fanSettings,
  flangeSettings,
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
import { motorFields } from './motor';
import _ from 'lodash';
import * as Component from '../components';

// constants begin
export enum Value {
  Device = 100,
  WindTurbine = 101,
  Flange = 102,
  Tower = 103,
  WindTurbinePro = 104,
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
  {
    key: Value.Device,
    label: Value[Value.Device],
    category: 'device'
  },
  {
    key: Value.WindTurbine,
    label: Value[Value.WindTurbine],
    category: 'folder',
    children: [Value.Flange, Value.Tower]
  },
  {
    key: Value.Flange,
    label: Value[Value.Flange],
    category: 'bolt',
    settings: flangeSettings.map((s) => ({ ...s, group: 'common.parameters' }))
  },
  {
    key: Value.Tower,
    label: Value[Value.Tower],
    category: 'bolt'
  },
  {
    key: Value.Area,
    label: Value[Value.Area],
    category: 'folder',
    children: [
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
    ]
  },
  {
    key: Value.Pipe,
    label: Value[Value.Pipe],
    category: 'corrosion'
  },
  {
    key: Value.Tank,
    label: Value[Value.Tank],
    category: 'corrosion'
  },
  {
    key: Value.Fan,
    label: Value[Value.Fan],
    category: 'vibration',
    settings: fanSettings
      .map((s) => ({ ...s, group: `${PREFIX}${Value[Value.Fan].toLowerCase()}.parameters` }))
      .concat(motorSettings),
    image: FanImage
  },
  {
    key: Value.Blower,
    label: Value[Value.Blower],
    category: 'vibration',
    settings: blowerSettings
      .map((s) => ({ ...s, group: `${PREFIX}${Value[Value.Blower].toLowerCase()}.parameters` }))
      .concat(motorSettings),
    filter: blowerType,
    image: BlowerImage
  },
  {
    key: Value.Compressor,
    label: Value[Value.Compressor],
    category: 'vibration',
    settings: compressorSettings
      .map((s) => ({ ...s, group: `${PREFIX}${Value[Value.Compressor].toLowerCase()}.parameters` }))
      .concat(motorSettings),
    filter: compressorType,
    image: CompressorImage
  },
  {
    key: Value.MotorGeneratorSet,
    label: Value[Value.MotorGeneratorSet],
    category: 'vibration',
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
    category: 'vibration',
    settings: motorSettings.map((s) => ({ ...s, source: '' } as SettingsField)),
    iconPath: '',
    image: MotorImage,
    componentIds: [
      Component.Value.MotorDriveEnd,
      Component.Value.MotorNonDriveEnd,
      Component.Value.GearboxInput,
      Component.Value.GearboxOutput
    ]
  },
  {
    key: Value.Pump,
    label: Value[Value.Pump],
    category: 'vibration',
    settings: pumpSettings
      .map((s) => ({ ...s, group: `${PREFIX}${Value[Value.Pump].toLowerCase()}.parameters` }))
      .concat(motorSettings),
    filter: pumpType,
    image: PumpImage
  },
  {
    key: Value.CoolingTower,
    label: Value[Value.CoolingTower],
    category: 'vibration',
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
    category: 'vibration',
    settings: chillerSettings
      .map((s) => ({ ...s, group: `${PREFIX}${Value[Value.Chiller].toLowerCase()}.parameters` }))
      .concat(motorSettings),
    filter: compressorType,
    image: CompressorImage
  }
];
// constants end

export const Categories = {
  getKeys: (categories: Config['category'][]) => getByCategory(categories).map((type) => type.key),
  getOptions: (categories: Config['category'][]) => getByCategory(categories).map(toOption)
};

const getByCategory = (categories: Config['category'][]) => {
  return configs.filter((type) => categories.includes(type.category));
};

const toOption = (type: Config) => ({
  value: type.key,
  label: Key.getLabel(type.key)
});

export const Key = {
  get,
  getLabel,
  getlabelPlural: (key: Value) => `${getLabel(key)}s`,
  getChildren: (key: Value) =>
    (get(key)?.children ?? [])
      .map(get)
      .filter((c) => !!c)
      .map(toOption),
  getParents: (key: Value) =>
    configs.filter((type) => type.children && type.children.includes(key)).map((c) => c.key),
  getSettings: (key: Value) => get(key)?.settings ?? [],
  getGroupedSettings: (key: Value) =>
    Object.entries(_.groupBy(Key.getSettings(key), (field) => field.group ?? '')),
  getImage: (key: Value) => get(key)?.image,
  getComponentIds: (key: Value) => get(key)?.componentIds ?? []
};

export const getNamePath = (source: SettingsField['source']) => {
  return source.length > 0 ? ['attributes', source] : ['attributes'];
};

function get(key: Value) {
  return configs.find((type) => type.key === key);
}

function getLabel(key: Value) {
  const type = get(key);
  return type ? `${PREFIX}${transformSnake2Dot(toSnake(type.label))}` : `${key}`;
}

// types begin
export type Config = {
  key: number;
  label: string;
  category: 'bolt' | 'vibration' | 'corrosion' | 'device' | 'folder';
  children?: number[];
  componentIds?: Component.Value[];
  settings?: SettingsField[];
  filter?: SettingsField;
  iconPath?: string;
  image?: string;
};
// types end
