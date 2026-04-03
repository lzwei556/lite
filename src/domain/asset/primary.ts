import { OMonitoringPoint, MonitoringPointType } from 'domain/monitoring-point';
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
  PrimaryAssetSettingsField
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
import { Component, ComponentId } from './component';
import { getGroupLabel, MotorSettingsGroup } from './settings/group';

enum Type {
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

type Config = {
  label: string;
  category: 'bolt' | 'vibration' | 'corrosion' | 'device';
  monitoringPointTypes: MonitoringPointType[];
  settings?: PrimaryAssetSettingsField[];
  filter?: PrimaryAssetSettingsField;
  componentIds?: ComponentId[];
  image?: string;
};

const table: { [Key in Type]: Config } = {
  [Type.Device]: {
    label: Type[Type.Device],
    category: 'device',
    monitoringPointTypes: [OMonitoringPoint.Type.Pressure, OMonitoringPoint.Type.Temperature]
  },
  [Type.Flange]: {
    label: Type[Type.Flange],
    category: 'bolt',
    monitoringPointTypes: OMonitoringPoint.Type.Category.boltsWithoutInclination,
    settings: flangeSettings
  },
  [Type.Tower]: {
    label: Type[Type.Tower],
    category: 'bolt',
    monitoringPointTypes: [
      OMonitoringPoint.Type.TopInclination,
      OMonitoringPoint.Type.BaseInclination
    ]
  },
  [Type.Pipe]: {
    label: Type[Type.Pipe],
    category: 'corrosion',
    monitoringPointTypes: OMonitoringPoint.Type.Category.corrosions
  },
  [Type.Tank]: {
    label: Type[Type.Tank],
    category: 'corrosion',
    monitoringPointTypes: OMonitoringPoint.Type.Category.corrosions
  },
  [Type.Fan]: {
    label: Type[Type.Fan],
    category: 'vibration',
    monitoringPointTypes: OMonitoringPoint.Type.Category.vibrations,
    settings: fanSettings,
    image: FanImage
  },
  [Type.Blower]: {
    label: Type[Type.Blower],
    category: 'vibration',
    monitoringPointTypes: OMonitoringPoint.Type.Category.vibrations,
    settings: blowerSettings,
    filter: blowerType,
    image: BlowerImage
  },
  [Type.Compressor]: {
    label: Type[Type.Compressor],
    category: 'vibration',
    monitoringPointTypes: OMonitoringPoint.Type.Category.vibrations,
    settings: compressorSettings,
    filter: compressorType,
    image: CompressorImage
  },
  [Type.MotorGeneratorSet]: {
    label: Type[Type.MotorGeneratorSet],
    category: 'vibration',
    monitoringPointTypes: OMonitoringPoint.Type.Category.vibrations,
    settings: motorSetSettings,
    image: MotorSetImage
  },
  [Type.Motor]: {
    label: Type[Type.Motor],
    category: 'vibration',
    monitoringPointTypes: OMonitoringPoint.Type.Category.vibrations,
    settings: motorSettings,
    componentIds: [
      Component.Id.MotorDriveEnd,
      Component.Id.MotorNonDriveEnd,
      Component.Id.GearboxInput,
      Component.Id.GearboxOutput
    ],
    image: MotorImage
  },
  [Type.Pump]: {
    label: Type[Type.Pump],
    category: 'vibration',
    monitoringPointTypes: OMonitoringPoint.Type.Category.vibrations,
    settings: pumpSettings,
    filter: pumpType,
    image: PumpImage
  },
  [Type.CoolingTower]: {
    label: Type[Type.CoolingTower],
    category: 'vibration',
    monitoringPointTypes: OMonitoringPoint.Type.Category.vibrations,
    settings: coolingTowerSettings,
    image: CoolingTowerImage
  },
  [Type.Chiller]: {
    label: Type[Type.Chiller],
    category: 'vibration',
    monitoringPointTypes: OMonitoringPoint.Type.Category.vibrations,
    settings: chillerSettings,
    filter: compressorType,
    image: CompressorImage // TODO: The image of chiller is unavailable now.
  }
};

const get = (type: Type): Config => table[type];

const getLabel = (type: Type) => {
  const PREFIX = 'asset.category.';
  const config = get(type);
  return type ? `${PREFIX}${transformSnake2Dot(toSnake(config.label))}` : `${type}`;
};

const getTypes = (categories: Config['category'][]): Type[] => {
  const result: Type[] = [];
  const set = new Set(categories);
  for (const [type, config] of Object.entries(table)) {
    if (set.has(config.category)) {
      result.push(Number(type) as Type);
    }
  }
  return result;
};

type AssetType = Type;
type AssetConfig = Config;
export namespace PrimaryAsset {
  export type Type = AssetType;
  export type Config = AssetConfig;
  export type SettingsField = PrimaryAssetSettingsField;
}

export const PrimaryAssetType = {
  ...Type,
  get types() {
    return Object.values(Type).filter((v) => typeof v === 'number') as Type[];
  },
  get,
  getLabel,
  getlabelPlural: (key: Type) => `${getLabel(key)}s`,
  getSettings: (type: Type) => get(type)?.settings ?? [],
  getGroupedSettings: (key: Type) =>
    Object.entries(
      _.groupBy(PrimaryAssetType.getSettings(key), (field) =>
        field.group ? getGroupLabel(field.group) : `${getLabel(key)}.parameters`
      )
    ),
  getComponentIds: (key: Type) => get(key)?.componentIds ?? [],
  getImage: (type: Type) => get(type)?.image,
  getMonitoringPointTypes: (types: Type[]): MonitoringPointType[] => {
    return Array.from(new Set(types.flatMap((type) => get(type)?.monitoringPointTypes ?? [])));
  },
  getTypesByMonitoringPointTypes: (pointTypes: MonitoringPointType[]): AssetType[] => {
    const set = new Set(pointTypes);
    return Object.keys(table)
      .map((key) => Number(key) as Type)
      .filter((type) => get(type).monitoringPointTypes.some((p) => set.has(p)));
  },
  Category: {
    getTypes,
    getTypeOptions: (categories: Config['category'][]) =>
      getTypes(categories).map((type) => ({ value: type, label: getLabel(type) })),
    vibrations: [
      Type.Fan,
      Type.Blower,
      Type.Compressor,
      Type.MotorGeneratorSet,
      Type.Motor,
      Type.Pump,
      Type.CoolingTower,
      Type.Chiller
    ],
    Flange: {
      isPreloadCalculationEnabled: (flange?: AssetRow) => flange?.attributes?.sub_type === 1,
      MonitoringPoints: {
        filter,
        sort,
        isPreload: (firstMonitoringPointType: number) => {
          return (
            firstMonitoringPointType === OMonitoringPoint.Type.BoltPreload ||
            firstMonitoringPointType === OMonitoringPoint.Type.AnchorPreload
          );
        },
        isLoosening: (firstMonitoringPointType: number) =>
          firstMonitoringPointType === OMonitoringPoint.Type.BoltLoosening
      }
    }
  },
  SettingsGroup: MotorSettingsGroup
};

function filter(measurements?: MonitoringPointRow[]) {
  if (!measurements) return [];
  return measurements.filter((point) => !OMonitoringPoint.Type.isVirtual(point.type));
}

function sort(measurements: MonitoringPointRow[]) {
  return measurements.sort((prev, next) => {
    const { index: prevIndex } = prev.attributes || { index: 88 };
    const { index: nextIndex } = next.attributes || { index: 88 };
    return prevIndex - nextIndex;
  });
}
