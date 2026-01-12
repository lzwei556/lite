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
  motorSettings,
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
const motorParametersKey = `${PREFIX}motor.parameters`;

const configs: Config[] = [
  {
    key: Value.Device,
    label: Value[Value.Device],
    category: 'device',
    labelPlural: 'asset.devices',
    children: []
  },
  {
    key: Value.WindTurbine,
    label: Value[Value.WindTurbine],
    category: 'folder',
    children: [Value.Flange, Value.Tower],
    isRoot: true
  },
  {
    key: Value.Flange,
    label: Value[Value.Flange],
    category: 'bolt',
    children: [],
    settings: [{ label: `common.parameters`, fields: flangeSettings }]
  },
  { key: Value.Tower, label: Value[Value.Tower], category: 'bolt', children: [] },
  {
    key: Value.Area,
    label: Value[Value.Area],
    category: 'folder',
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
  {
    key: Value.Pipe,
    label: Value[Value.Pipe],
    category: 'corrosion',
    labelPlural: 'pipes',
    children: []
  },
  {
    key: Value.Tank,
    label: Value[Value.Tank],
    category: 'corrosion',
    labelPlural: 'tanks',
    children: []
  },
  {
    key: Value.Fan,
    label: Value[Value.Fan],
    category: 'vibration',
    labelPlural: `${PREFIX}fans`,
    children: [],
    settings: [
      { label: `${PREFIX}fan.parameters`, fields: fanSettings },
      { label: motorParametersKey, fields: motorSettings }
    ],
    image: FanImage
  },
  {
    key: Value.Blower,
    label: Value[Value.Blower],
    category: 'vibration',
    labelPlural: `${PREFIX}blowers`,
    children: [],
    settings: [
      { label: `${PREFIX}blower.parameters`, fields: blowerSettings },
      { label: motorParametersKey, fields: motorSettings }
    ],
    filter: blowerType,
    image: BlowerImage
  },
  {
    key: Value.Compressor,
    label: Value[Value.Compressor],
    category: 'vibration',
    labelPlural: `${PREFIX}compressors`,
    children: [],
    settings: [
      { label: `${PREFIX}compressor.parameters`, fields: compressorSettings },
      { label: motorParametersKey, fields: motorSettings }
    ],
    filter: compressorType,
    image: CompressorImage
  },
  {
    key: Value.MotorGeneratorSet,
    label: Value[Value.MotorGeneratorSet],
    category: 'vibration',
    labelPlural: `${PREFIX}motor.generator.sets`,
    children: [],
    settings: [
      { label: `${PREFIX}motor.generator.set.parameters`, fields: motorSetSettings },
      { label: motorParametersKey, fields: motorSettings }
    ],
    image: MotorSetImage
  },
  {
    key: Value.Motor,
    label: Value[Value.Motor],
    category: 'vibration',
    labelPlural: `${PREFIX}motors`,
    children: [],
    settings: [
      {
        label: motorParametersKey,
        fields: motorSettings.map((s) => ({ ...s, source: '' } as SettingsField))
      }
    ],
    iconPath: '',
    image: MotorImage
  },
  {
    key: Value.Pump,
    label: Value[Value.Pump],
    category: 'vibration',
    labelPlural: `${PREFIX}pumps`,
    children: [],
    settings: [
      { label: `${PREFIX}pump.parameters`, fields: pumpSettings },
      { label: motorParametersKey, fields: motorSettings }
    ],
    filter: pumpType,
    image: PumpImage
  },
  {
    key: Value.CoolingTower,
    label: Value[Value.CoolingTower],
    category: 'vibration',
    labelPlural: `${PREFIX}cooling.towers`,
    children: [],
    settings: [
      { label: `${PREFIX}cooling.tower.parameters`, fields: coolingTowerSettings },
      { label: motorParametersKey, fields: motorSettings }
    ],
    image: CoolingTowerImage
  },
  {
    key: Value.Chiller,
    label: Value[Value.Chiller],
    category: 'vibration',
    labelPlural: `${PREFIX}chillers`,
    children: [],
    settings: [
      { label: `${PREFIX}chiller.parameters`, fields: chillerSettings },
      { label: motorParametersKey, fields: motorSettings }
    ],
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
  getLabel: (key: Value) => {
    const type = get(key);
    return type ? `${PREFIX}${transformSnake2Dot(toSnake(type.label))}` : `${key}`;
  },
  getlabelPlural: (key: Value) => get(key)?.labelPlural,
  getSettings: (key: Value) => get(key)?.settings ?? [],
  getImage: (key: Value) => get(key)?.image
};

export const getNamePath = (source: SettingsField['source']) => {
  return source.length > 0 ? ['attributes', source] : ['attributes'];
};

function get(key: Value) {
  return configs.find((type) => type.key === key) || null;
}

// types begin
export type Config = {
  key: number;
  label: string;
  category: 'bolt' | 'vibration' | 'corrosion' | 'device' | 'folder';
  labelPlural?: string;
  children: number[];
  isRoot?: boolean;
  settings?: { label: string; fields: SettingsField[] }[];
  filter?: SettingsField;
  iconPath?: string;
  image?: string;
};
// types end
