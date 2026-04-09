import * as MonitoringPoint from '../monitoring-point';
import {
  blowerSettings,
  chillerSettings,
  compressorSettings,
  coolingTowerSettings,
  fanSettings,
  flangeSettings,
  motorSetSettings,
  motorSettings,
  pumpSettings,
  Settings
} from './settings/capability';
import { AssetRow, MonitoringPointRow } from 'asset-common';
import { toSnake } from 'ts-case-convert';
import { transformSnake2Dot } from 'utils/format';
import MotorSetImage from './images/motor-set.png';
import MotorImage from './images/motor.png';
import FanImage from './images/fan.png';
import BlowerImage from './images/blower.png';
import CoolingTowerImage from './images/cooling-tower.png';
import PumpImage from './images/pump.png';
import CompressorImage from './images/compressor.png';
import _ from 'lodash';
import { blowerType, compressorType, pumpType } from './settings/motor-as';
import * as Component from './component';
import { getGroupLabel } from './settings/group';

export { SettingsGroup } from './settings/group';

export enum Enum {
  Device = 100,
  Flange = 102,
  Tower = 103,
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
export const Enums = Object.values(Enum).filter((v) => typeof v === 'number') as Enum[];

export type Config = {
  label: string;
  category: 'bolt' | 'vibration' | 'corrosion' | 'device';
  monitoringPointTypes: MonitoringPoint.Type.Enum[];
  settings?: Settings[];
  filter?: Settings;
  componentIds?: Component.Id[];
  image?: string;
};

const table: { [Key in Enum]: Config } = {
  [Enum.Device]: {
    label: Enum[Enum.Device],
    category: 'device',
    monitoringPointTypes: [
      MonitoringPoint.Type.Enum.Pressure,
      MonitoringPoint.Type.Enum.Temperature
    ]
  },
  [Enum.Flange]: {
    label: Enum[Enum.Flange],
    category: 'bolt',
    monitoringPointTypes: MonitoringPoint.Type.Category.boltsWithoutInclination,
    settings: flangeSettings
  },
  [Enum.Tower]: {
    label: Enum[Enum.Tower],
    category: 'bolt',
    monitoringPointTypes: [
      MonitoringPoint.Type.Enum.TopInclination,
      MonitoringPoint.Type.Enum.BaseInclination
    ]
  },
  [Enum.Pipe]: {
    label: Enum[Enum.Pipe],
    category: 'corrosion',
    monitoringPointTypes: MonitoringPoint.Type.Category.corrosions
  },
  [Enum.Tank]: {
    label: Enum[Enum.Tank],
    category: 'corrosion',
    monitoringPointTypes: MonitoringPoint.Type.Category.corrosions
  },
  [Enum.Fan]: {
    label: Enum[Enum.Fan],
    category: 'vibration',
    monitoringPointTypes: MonitoringPoint.Type.Category.vibrations,
    settings: fanSettings,
    image: FanImage
  },
  [Enum.Blower]: {
    label: Enum[Enum.Blower],
    category: 'vibration',
    monitoringPointTypes: MonitoringPoint.Type.Category.vibrations,
    settings: blowerSettings,
    filter: blowerType,
    image: BlowerImage
  },
  [Enum.Compressor]: {
    label: Enum[Enum.Compressor],
    category: 'vibration',
    monitoringPointTypes: MonitoringPoint.Type.Category.vibrations,
    settings: compressorSettings,
    filter: compressorType,
    image: CompressorImage
  },
  [Enum.MotorGeneratorSet]: {
    label: Enum[Enum.MotorGeneratorSet],
    category: 'vibration',
    monitoringPointTypes: MonitoringPoint.Type.Category.vibrations,
    settings: motorSetSettings,
    image: MotorSetImage
  },
  [Enum.Motor]: {
    label: Enum[Enum.Motor],
    category: 'vibration',
    monitoringPointTypes: MonitoringPoint.Type.Category.vibrations,
    settings: motorSettings,
    componentIds: [
      Component.Id.MotorDriveEnd,
      Component.Id.MotorNonDriveEnd,
      Component.Id.GearboxInput,
      Component.Id.GearboxOutput
    ],
    image: MotorImage
  },
  [Enum.Pump]: {
    label: Enum[Enum.Pump],
    category: 'vibration',
    monitoringPointTypes: MonitoringPoint.Type.Category.vibrations,
    settings: pumpSettings,
    filter: pumpType,
    image: PumpImage
  },
  [Enum.CoolingTower]: {
    label: Enum[Enum.CoolingTower],
    category: 'vibration',
    monitoringPointTypes: MonitoringPoint.Type.Category.vibrations,
    settings: coolingTowerSettings,
    image: CoolingTowerImage
  },
  [Enum.Chiller]: {
    label: Enum[Enum.Chiller],
    category: 'vibration',
    monitoringPointTypes: MonitoringPoint.Type.Category.vibrations,
    settings: chillerSettings,
    filter: compressorType,
    image: CompressorImage // TODO: The image of chiller is unavailable now.
  }
};

export type { Settings };

export const get = (type: Enum): Config => table[type];

export const getLabel = (type: Enum) => {
  const PREFIX = 'asset.category.';
  const config = get(type);
  return type ? `${PREFIX}${transformSnake2Dot(toSnake(config.label))}` : `${type}`;
};

export const getlabelPlural = (key: Enum) => `${getLabel(key)}s`;
export const getSettings = (type: Enum) => get(type)?.settings ?? [];
export const getGroupedSettings = (key: Enum) =>
  Object.entries(
    _.groupBy(getSettings(key), (field) =>
      field.group ? getGroupLabel(field.group) : `${getLabel(key)}.parameters`
    )
  );
export const getComponentIds = (key: Enum) => get(key)?.componentIds ?? [];
export const getImage = (type: Enum) => get(type)?.image;
export const getMonitoringPointTypes = (types: Enum[]): MonitoringPoint.Type.Enum[] => {
  return Array.from(new Set(types.flatMap((type) => get(type)?.monitoringPointTypes ?? [])));
};
export const getTypesByMonitoringPointTypes = (pointTypes: MonitoringPoint.Type.Enum[]): Enum[] => {
  const set = new Set(pointTypes);
  return Object.keys(table)
    .map((key) => Number(key) as Enum)
    .filter((type) => get(type).monitoringPointTypes.some((p) => set.has(p)));
};

const getTypes = (categories: Config['category'][]): Enum[] => {
  const result: Enum[] = [];
  const set = new Set(categories);
  for (const [type, config] of Object.entries(table)) {
    if (set.has(config.category)) {
      result.push(Number(type) as Enum);
    }
  }
  return result;
};

export const Category = {
  getTypes,
  getTypeOptions: (categories: Config['category'][]) =>
    getTypes(categories).map((type) => ({ value: type, label: getLabel(type) })),
  vibrations: [
    Enum.Fan,
    Enum.Blower,
    Enum.Compressor,
    Enum.MotorGeneratorSet,
    Enum.Motor,
    Enum.Pump,
    Enum.CoolingTower,
    Enum.Chiller
  ],
  Flange: {
    isPreloadCalculationEnabled: (flange?: AssetRow) => flange?.attributes?.sub_type === 1,
    MonitoringPoints: {
      filter,
      sort,
      isPreload: (firstMonitoringPointType: number) => {
        return (
          firstMonitoringPointType === MonitoringPoint.Type.Enum.BoltPreload ||
          firstMonitoringPointType === MonitoringPoint.Type.Enum.AnchorPreload
        );
      },
      isLoosening: (firstMonitoringPointType: number) =>
        firstMonitoringPointType === MonitoringPoint.Type.Enum.BoltLoosening
    }
  }
};

function filter(measurements?: MonitoringPointRow[]) {
  if (!measurements) return [];
  return measurements.filter((point) => !MonitoringPoint.Type.isVirtual(point.type));
}

function sort(measurements: MonitoringPointRow[]) {
  return measurements.sort((prev, next) => {
    const { index: prevIndex } = prev.attributes || { index: 88 };
    const { index: nextIndex } = next.attributes || { index: 88 };
    return prevIndex - nextIndex;
  });
}
