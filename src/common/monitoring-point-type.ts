import { transformSnake2Dot } from 'utils';
import { DeviceType } from '../types/device_type';
import { toSnake } from 'ts-case-convert';
import { DisplayProperty, CATEGORIES } from './feature-data';
import {
  AttributesField,
  baseInclinationFields,
  corrosionFields,
  positionField,
  topInclinationFields,
  vibrationFields
} from './monitoring-point-attributes';
import { AssetCategory } from './asset-category';
import { Property } from './monitoring-point';

// constants begin
export enum Value {
  BoltLoosening = 10101,
  Corrosion = 10201,
  HighTemperatureCorrosion = 10203,
  UltraHighTemperatureCorrosion = 10202,
  BoltPreload = 10301,
  AnchorPreload = 10303,
  FlangeBoltPreload = 10311,
  FlangeAnchorPreload = 10312,
  Vibration = 10401,
  VibrationRotationSingleAxis = 10402,
  VibrationRotation = 10403,
  VibrationAudio = 10411,
  Inclination = 10501,
  TopInclination = 10511,
  BaseInclination = 10512,
  Pressure = 10602,
  Temperature = 10801,
  OilFiller = 11101
}

const configs: Config[] = [
  {
    key: Value.BoltLoosening,
    label: Value[Value.BoltLoosening],
    category: 'loosening',
    deviceTypes: [DeviceType.SA, DeviceType.SA_S],
    properties: CATEGORIES.SA,
    flangeAttributesKey: 'initial',
    attributes: [positionField],
    assetCategories: [AssetCategory.Value.Flange]
  },
  {
    key: Value.Corrosion,
    label: Value[Value.Corrosion],
    category: 'corrosion',
    deviceTypes: DeviceType.getDCSensors(),
    properties: CATEGORIES.DC_NORMAL,
    attributes: corrosionFields,
    assetCategories: [AssetCategory.Value.Pipe, AssetCategory.Value.Tank],
    processIdForBindingSensor: 11
  },
  {
    key: Value.HighTemperatureCorrosion,
    label: Value[Value.HighTemperatureCorrosion],
    category: 'corrosion',
    deviceTypes: DeviceType.getHighDCSensors(),
    properties: CATEGORIES.DC_HIGH,
    attributes: corrosionFields,
    assetCategories: [AssetCategory.Value.Pipe, AssetCategory.Value.Tank],
    processIdForBindingSensor: 11
  },
  {
    key: Value.UltraHighTemperatureCorrosion,
    label: Value[Value.UltraHighTemperatureCorrosion],
    category: 'corrosion',
    deviceTypes: DeviceType.getUltraHighDCSensors(),
    properties: CATEGORIES.DC_Ultra_HIGH,
    attributes: corrosionFields,
    assetCategories: [AssetCategory.Value.Pipe, AssetCategory.Value.Tank],
    processIdForBindingSensor: 11
  },
  {
    key: Value.BoltPreload,
    label: Value[Value.BoltPreload],
    category: 'preload',
    deviceTypes: [
      DeviceType.SAS,
      DeviceType.SASLoraWAN,
      DeviceType.DS4,
      DeviceType.DS8,
      DeviceType.SAS120D,
      DeviceType.SAS120Q
    ],
    properties: CATEGORIES.SAS,
    flangeAttributesKey: 'normal',
    attributes: [positionField],
    assetCategories: [AssetCategory.Value.Flange]
  },
  {
    key: Value.AnchorPreload,
    label: Value[Value.AnchorPreload],
    category: 'preload',
    deviceTypes: [DeviceType.SAS, DeviceType.SASLoraWAN],
    properties: CATEGORIES.SAS,
    flangeAttributesKey: 'normal',
    attributes: [positionField],
    assetCategories: [AssetCategory.Value.Flange]
  },
  {
    key: Value.FlangeBoltPreload,
    label: Value[Value.FlangeBoltPreload],
    category: 'flage-preload',
    deviceTypes: [
      DeviceType.SAS,
      DeviceType.SASLoraWAN,
      DeviceType.DS4,
      DeviceType.DS8,
      DeviceType.SAS120D,
      DeviceType.SAS120Q
    ],
    properties: CATEGORIES.SAS,
    attributes: [positionField],
    assetCategories: [AssetCategory.Value.Flange]
  },
  {
    key: Value.FlangeAnchorPreload,
    label: Value[Value.FlangeAnchorPreload],
    category: 'flage-preload',
    deviceTypes: [
      DeviceType.SAS,
      DeviceType.SASLoraWAN,
      DeviceType.DS4,
      DeviceType.DS8,
      DeviceType.SAS120D,
      DeviceType.SAS120Q
    ],
    properties: CATEGORIES.SAS,
    attributes: [positionField],
    assetCategories: [AssetCategory.Value.Flange]
  },
  {
    key: Value.Vibration,
    label: Value[Value.Vibration],
    category: 'vibration',
    deviceTypes: [
      DeviceType.SVT220520P,
      DeviceType.SVT520C,
      DeviceType.SVT210510P,
      DeviceType.SVT510C,
      DeviceType.SVT210K,
      DeviceType.SVT210A
    ],
    properties: CATEGORIES.SVT210510P,
    attributes: vibrationFields,
    assetCategories: [AssetCategory.Value.Motor]
  },
  {
    key: Value.VibrationRotationSingleAxis,
    label: Value[Value.VibrationRotationSingleAxis],
    category: 'vibration',
    deviceTypes: [DeviceType.SVT220S1],
    properties: CATEGORIES.SVT220S1S3,
    attributes: vibrationFields,
    assetCategories: [AssetCategory.Value.Motor]
  },
  {
    key: Value.VibrationRotation,
    label: Value[Value.VibrationRotation],
    category: 'vibration',
    deviceTypes: [DeviceType.SVT210S, DeviceType.SVT220S3, DeviceType.SVT510L, DeviceType.SVT210SU],
    properties: CATEGORIES.SVT220S1S3,
    attributes: vibrationFields,
    assetCategories: [AssetCategory.Value.Motor]
  },
  {
    key: Value.VibrationAudio,
    label: Value[Value.VibrationAudio],
    category: 'vibration',
    deviceTypes: [DeviceType.SVT210SU],
    properties: CATEGORIES.SVT210SU,
    attributes: vibrationFields,
    assetCategories: [AssetCategory.Value.Motor]
  },
  {
    key: Value.OilFiller,
    label: Value[Value.OilFiller],
    category: 'vibration',
    deviceTypes: [DeviceType.OilFiller],
    properties: CATEGORIES.OilFiller,
    attributes: [],
    assetCategories: [AssetCategory.Value.Motor]
  },
  // {
  //   key: Value.Inclination,
  //   label: Value[Value.Inclination],
  //   category: 'loosening',
  //   deviceTypes: [DeviceType.SQ100, DeviceType.SQ110C],
  //   properties: CATEGORIES.TopInclination
  // },
  {
    key: Value.TopInclination,
    label: Value[Value.TopInclination],
    category: 'inclination',
    deviceTypes: [DeviceType.SQ100, DeviceType.SQ110C],
    properties: CATEGORIES.TopInclination,
    inclinationDisplacement: 'RADIAL',
    attributes: topInclinationFields,
    assetCategories: [AssetCategory.Value.Tower],
    processIdForBindingSensor: 21
  },
  {
    key: Value.BaseInclination,
    label: Value[Value.BaseInclination],
    category: 'inclination',
    deviceTypes: [DeviceType.SQ100, DeviceType.SQ110C],
    properties: CATEGORIES.BaseInclination,
    inclinationDisplacement: 'AXIAL',
    attributes: baseInclinationFields,
    assetCategories: [AssetCategory.Value.Tower],
    processIdForBindingSensor: 21
  },
  {
    key: Value.Pressure,
    label: Value[Value.Pressure],
    category: 'pressure',
    deviceTypes: [DeviceType.SPT510],
    properties: CATEGORIES.SPT,
    attributes: [positionField],
    assetCategories: [AssetCategory.Value.Device]
  },
  {
    key: Value.Temperature,
    label: Value[Value.Temperature],
    category: 'temperature',
    deviceTypes: [DeviceType.ST100, DeviceType.ST101L, DeviceType.ST101S],
    properties: CATEGORIES.ST,
    attributes: [positionField],
    assetCategories: [AssetCategory.Value.Device]
  }
];
// constants end

// helpers begin
export const Categories = {
  getKeys: (categories: Config['category'][]) => {
    return getByCategory(categories).map((type) => type.key);
  },
  getOptions: (categories: Config['category'][]) => {
    return getByCategory(categories).map(toOption);
  },
  getGeneralOptions: () => getGeneralByCategory().map(toOption),
  getDeviceTypes: (categories: Config['category'][]) => {
    return getByCategory(categories).reduce(flatten, [] as number[]);
  },
  getGeneralDeviceTypes: () => getGeneralByCategory().reduce(flatten, [] as number[])
};

const toOption = (type: Config) => ({
  value: type.key,
  label: Key.getLabel(type.key)
});

const flatten = (initial: number[], value: Config) => {
  value.deviceTypes.forEach((type) => {
    if (!initial.includes(type)) {
      initial.push(type);
    }
  });
  return initial;
};

const getGeneralByCategory = () => {
  return getByCategory([
    'loosening',
    'corrosion',
    'preload',
    'vibration',
    'inclination',
    'pressure',
    'temperature'
  ]);
};

const getByCategory = (categories: Config['category'][]) => {
  return configs.filter((type) => categories.includes(type.category));
};

const PREFIX = 'monitoring.point.type.';

export const Key = {
  getLabel: (key: Value) => {
    const type = get(key);
    return type ? `${PREFIX}${transformSnake2Dot(toSnake(type.label))}` : `${key}`;
  },
  getProperties: (key: Value, properties: Property[] = []) => {
    const type = get(key);
    const dispalyProperties = type?.properties;
    if (!dispalyProperties || dispalyProperties.length === 0) {
      return properties
        .filter((p) => !!p.isShow)
        .sort((prev, crt) => prev.sort - crt.sort) as DisplayProperty[];
    } else {
      return dispalyProperties
        .map((p) => {
          const fields = properties.find((r) => r.key === p.key)?.fields ?? [];
          return {
            ...p,
            fields:
              p.fields ??
              fields.map((f, i) => ({
                ...f,
                first: p.defaultFirstFieldKey
                  ? f.key === p.defaultFirstFieldKey
                  : i === fields.length - 1
              }))
          };
        })
        .filter((p) => !!p.fields) as DisplayProperty[];
    }
  },
  getDeviceTypes: (key: Value) => get(key)?.deviceTypes ?? [],
  filterNonVirtualTypes: (key: Value) => key !== Value.FlangeBoltPreload,
  getFlangeAttributesKey: (key: Value) => get(key)?.flangeAttributesKey,
  getInclinationDisplacement: (key: Value) => get(key)?.inclinationDisplacement ?? 'RADIAL',
  getAttributes: (key: Value) => get(key)?.attributes ?? [],
  getAssetCategories: (key: Value) => get(key)?.assetCategories ?? [],
  getProcessId: (key: Value) => get(key)?.processIdForBindingSensor
};

function get(key: Value) {
  return configs.find((type) => type.key === key) || null;
}
// helpers end

// types begin
type Config = {
  // key:Value;
  key: number;
  label: string;
  category:
    | 'preload'
    | 'flage-preload'
    | 'loosening'
    | 'inclination'
    | 'vibration'
    | 'corrosion'
    | 'temperature'
    | 'pressure';
  deviceTypes: DeviceType[];
  properties: readonly DisplayProperty[];
  flangeAttributesKey?: string;
  inclinationDisplacement?: 'AXIAL' | 'RADIAL';
  attributes: AttributesField[];
  assetCategories: AssetCategory.Value[];
  processIdForBindingSensor?: number;
};
// types end
