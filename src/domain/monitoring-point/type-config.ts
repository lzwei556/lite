import * as Feature from '../feature-property';
import { DeviceType } from 'types/device_type';
import { Property } from './types';
import { transformSnake2Dot } from 'utils/format';
import { toSnake } from 'ts-case-convert';
import { Field } from 'types';
import * as Settings from './settings';

export enum Enum {
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
  // Inclination = 10501,
  TopInclination = 10511,
  BaseInclination = 10512,
  Pressure = 10602,
  Temperature = 10801,
  OilFiller = 11101
}

export const Enums = Object.values(Enum).filter((v) => typeof v === 'number') as Enum[];

type Config = {
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
  properties: readonly Feature.Types.Property[];
  settings: Field<Settings.Entity>[];
  processId?: number;
};

const table: { [Key in Enum]: Config } = {
  [Enum.BoltLoosening]: {
    label: Enum[Enum.BoltLoosening],
    category: 'loosening',
    deviceTypes: [DeviceType.SA, DeviceType.SA_S],
    properties: Feature.Property.SA.properties,
    settings: [Settings.Config.PositionField]
  },
  [Enum.Corrosion]: {
    label: Enum[Enum.Corrosion],
    category: 'corrosion',
    deviceTypes: DeviceType.getDCSensors(),
    properties: Feature.Property.DC.properties,
    settings: Settings.CorrosionConfig.Fields
  },
  [Enum.HighTemperatureCorrosion]: {
    label: Enum[Enum.HighTemperatureCorrosion],
    category: 'corrosion',
    deviceTypes: DeviceType.getHighDCSensors(),
    properties: Feature.Property.DC_HIGH_TEMPERATURE.properties,
    settings: Settings.CorrosionConfig.Fields
  },
  [Enum.UltraHighTemperatureCorrosion]: {
    label: Enum[Enum.UltraHighTemperatureCorrosion],
    category: 'corrosion',
    deviceTypes: DeviceType.getUltraHighDCSensors(),
    properties: Feature.Property.DC_ULTRA_HIGH_TEMPERATURE.properties,
    settings: Settings.CorrosionConfig.Fields
  },
  [Enum.BoltPreload]: {
    label: Enum[Enum.BoltPreload],
    category: 'preload',
    deviceTypes: [
      DeviceType.SAS,
      DeviceType.SASLoraWAN,
      DeviceType.DS4,
      DeviceType.DS8,
      DeviceType.SAS120D,
      DeviceType.SAS120Q
    ],
    properties: Feature.Property.SAS.properties,
    settings: [Settings.Config.PositionField]
  },
  [Enum.AnchorPreload]: {
    label: Enum[Enum.AnchorPreload],
    category: 'preload',
    deviceTypes: [DeviceType.SAS, DeviceType.SASLoraWAN],
    properties: Feature.Property.SAS.properties,
    settings: [Settings.Config.PositionField]
  },
  [Enum.FlangeBoltPreload]: {
    label: Enum[Enum.FlangeBoltPreload],
    category: 'flage-preload',
    deviceTypes: [
      DeviceType.SAS,
      DeviceType.SASLoraWAN,
      DeviceType.DS4,
      DeviceType.DS8,
      DeviceType.SAS120D,
      DeviceType.SAS120Q
    ],
    properties: Feature.Property.SAS.properties,
    settings: [Settings.Config.PositionField]
  },
  [Enum.FlangeAnchorPreload]: {
    label: Enum[Enum.FlangeAnchorPreload],
    category: 'flage-preload',
    deviceTypes: [
      DeviceType.SAS,
      DeviceType.SASLoraWAN,
      DeviceType.DS4,
      DeviceType.DS8,
      DeviceType.SAS120D,
      DeviceType.SAS120Q
    ],
    properties: Feature.Property.SAS.properties,
    settings: [Settings.Config.PositionField]
  },
  [Enum.Vibration]: {
    label: Enum[Enum.Vibration],
    category: 'vibration',
    deviceTypes: [
      DeviceType.SVT220520P,
      DeviceType.SVT520C,
      DeviceType.SVT210510P,
      DeviceType.SVT510C,
      DeviceType.SVT210K,
      DeviceType.SVT210A
    ],
    properties: Feature.Property.SVT_WIRELESS.properties,
    settings: Settings.Config.Vibration.Fields
  },
  [Enum.VibrationRotationSingleAxis]: {
    label: Enum[Enum.VibrationRotationSingleAxis],
    category: 'vibration',
    deviceTypes: [DeviceType.SVT220S1],
    properties: Feature.Property.SVT_RS485.properties,
    settings: Settings.Config.Vibration.Fields
  },
  [Enum.VibrationRotation]: {
    label: Enum[Enum.VibrationRotation],
    category: 'vibration',
    deviceTypes: [DeviceType.SVT210S, DeviceType.SVT220S3, DeviceType.SVT510L, DeviceType.SVT210SU],
    properties: Feature.Property.SVT_RS485.properties,
    settings: Settings.Config.Vibration.Fields
  },
  [Enum.VibrationAudio]: {
    label: Enum[Enum.VibrationAudio],
    category: 'vibration',
    deviceTypes: [DeviceType.SVT210SU],
    properties: Feature.Property.SVT_AUDIO.properties,
    settings: Settings.Config.Vibration.Fields
  },
  // [Enum.Inclination]: {
  //   label: Enum[Enum.Inclination],
  //   category: 'inclination',
  //   deviceTypes: [DeviceType.SQ100, DeviceType.SQ110C]
  // },
  [Enum.TopInclination]: {
    label: Enum[Enum.TopInclination],
    category: 'inclination',
    deviceTypes: [DeviceType.SQ100, DeviceType.SQ110C],
    properties: Feature.Property.TopInclination.properties,
    settings: Settings.Config.TopInclination
  },
  [Enum.BaseInclination]: {
    label: Enum[Enum.BaseInclination],
    category: 'inclination',
    deviceTypes: [DeviceType.SQ100, DeviceType.SQ110C],
    properties: Feature.Property.BaseInclination.properties,
    settings: Settings.Config.BaseInclination
  },
  [Enum.Pressure]: {
    label: Enum[Enum.Pressure],
    category: 'pressure',
    deviceTypes: [DeviceType.SPT510],
    properties: Feature.Property.SPT.properties,
    settings: [Settings.Config.PositionField]
  },
  [Enum.Temperature]: {
    label: Enum[Enum.Temperature],
    category: 'temperature',
    deviceTypes: [DeviceType.ST100, DeviceType.ST101L, DeviceType.ST101S],
    properties: Feature.Property.ST.properties,
    settings: [Settings.Config.PositionField]
  },
  [Enum.OilFiller]: {
    label: Enum[Enum.OilFiller],
    category: 'vibration',
    deviceTypes: [DeviceType.OilFiller],
    properties: Feature.Property.OilFiller.properties,
    settings: []
  }
};

const get = (type: Enum): Config => table[type];
export const getLabel = (key: Enum) => {
  const PREFIX = 'monitoring.point.type.';
  const type = get(key);
  return type ? `${PREFIX}${transformSnake2Dot(toSnake(type.label))}` : `${key}`;
};
const toOption = (type: Enum) => ({
  value: type,
  label: getLabel(type)
});
export const getDeviceTypes = (key: Enum) => get(key)?.deviceTypes ?? [];
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

export const getSettings = (type: Enum) => get(type)?.settings ?? [];

export const getProcessId = (type: Enum) => get(type)?.processId;

export const isVirtual = (type: Enum) => type === Enum.FlangeBoltPreload;

export function getProperties({ type, properties = [] }: { type: Enum; properties?: Property[] }) {
  const config = get(type);
  const dispalyProperties = config?.properties;
  if (!dispalyProperties || dispalyProperties.length === 0) {
    return properties
      .filter((p) => !!p.isShow)
      .sort((prev, crt) => prev.sort - crt.sort) as Feature.Types.Property[];
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
      .filter((p) => !!p.fields) as Feature.Types.Property[];
  }
}

export const Category = {
  getTypes,
  getOptions: (categories: Config['category'][]) => {
    const set = new Set(categories);
    return (Object.keys(table) as unknown as Enum[])
      .filter((type) => set.has(table[type].category))
      .map(toOption);
  },
  getDeviceTypes: (categories: Config['category'][]): DeviceType[] => {
    const deviceTypes = new Set<DeviceType>();
    getTypes(categories).forEach((type) => {
      getDeviceTypes(type).forEach((deviceType) => {
        deviceTypes.add(deviceType);
      });
    });
    return Array.from(deviceTypes);
  },
  boltsWithoutInclination: [
    Enum.BoltLoosening,
    Enum.BoltPreload,
    Enum.AnchorPreload,
    Enum.FlangeBoltPreload,
    Enum.FlangeAnchorPreload
  ],
  corrosions: [Enum.Corrosion, Enum.HighTemperatureCorrosion, Enum.UltraHighTemperatureCorrosion],
  vibrations: [
    Enum.Vibration,
    Enum.VibrationRotationSingleAxis,
    Enum.VibrationRotation,
    Enum.VibrationAudio
  ],
  Inclination: {
    getDisplacementKey: (type: Enum) => (type === Enum.TopInclination ? 'RADIAL' : 'AXIAL')
  }
};
