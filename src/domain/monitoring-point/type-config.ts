import { FeatureProperty, Feature } from 'domain/feature-property';
import { DeviceType } from 'types/device_type';
import { Property } from './types';
import { transformSnake2Dot } from 'utils/format';
import { toSnake } from 'ts-case-convert';
import { Field } from 'types';
import { MonitoringPointSettings, MonitoringPointSettingsFieldConfig } from './settings';

export enum Type {
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
  properties: readonly Feature.Property[];
  settings: Field<MonitoringPointSettings>[];
  processId?: number;
};

const table: { [Key in Type]: Config } = {
  [Type.BoltLoosening]: {
    label: Type[Type.BoltLoosening],
    category: 'loosening',
    deviceTypes: [DeviceType.SA, DeviceType.SA_S],
    properties: FeatureProperty.SA.properties,
    settings: [MonitoringPointSettingsFieldConfig.PositionField]
  },
  [Type.Corrosion]: {
    label: Type[Type.Corrosion],
    category: 'corrosion',
    deviceTypes: DeviceType.getDCSensors(),
    properties: FeatureProperty.DC.properties,
    settings: MonitoringPointSettingsFieldConfig.Corrosion.Fields
  },
  [Type.HighTemperatureCorrosion]: {
    label: Type[Type.HighTemperatureCorrosion],
    category: 'corrosion',
    deviceTypes: DeviceType.getHighDCSensors(),
    properties: FeatureProperty.DC_HIGH_TEMPERATURE.properties,
    settings: MonitoringPointSettingsFieldConfig.Corrosion.Fields
  },
  [Type.UltraHighTemperatureCorrosion]: {
    label: Type[Type.UltraHighTemperatureCorrosion],
    category: 'corrosion',
    deviceTypes: DeviceType.getUltraHighDCSensors(),
    properties: FeatureProperty.DC_ULTRA_HIGH_TEMPERATURE.properties,
    settings: MonitoringPointSettingsFieldConfig.Corrosion.Fields
  },
  [Type.BoltPreload]: {
    label: Type[Type.BoltPreload],
    category: 'preload',
    deviceTypes: [
      DeviceType.SAS,
      DeviceType.SASLoraWAN,
      DeviceType.DS4,
      DeviceType.DS8,
      DeviceType.SAS120D,
      DeviceType.SAS120Q
    ],
    properties: FeatureProperty.SAS.properties,
    settings: [MonitoringPointSettingsFieldConfig.PositionField]
  },
  [Type.AnchorPreload]: {
    label: Type[Type.AnchorPreload],
    category: 'preload',
    deviceTypes: [DeviceType.SAS, DeviceType.SASLoraWAN],
    properties: FeatureProperty.SAS.properties,
    settings: [MonitoringPointSettingsFieldConfig.PositionField]
  },
  [Type.FlangeBoltPreload]: {
    label: Type[Type.FlangeBoltPreload],
    category: 'flage-preload',
    deviceTypes: [
      DeviceType.SAS,
      DeviceType.SASLoraWAN,
      DeviceType.DS4,
      DeviceType.DS8,
      DeviceType.SAS120D,
      DeviceType.SAS120Q
    ],
    properties: FeatureProperty.SAS.properties,
    settings: [MonitoringPointSettingsFieldConfig.PositionField]
  },
  [Type.FlangeAnchorPreload]: {
    label: Type[Type.FlangeAnchorPreload],
    category: 'flage-preload',
    deviceTypes: [
      DeviceType.SAS,
      DeviceType.SASLoraWAN,
      DeviceType.DS4,
      DeviceType.DS8,
      DeviceType.SAS120D,
      DeviceType.SAS120Q
    ],
    properties: FeatureProperty.SAS.properties,
    settings: [MonitoringPointSettingsFieldConfig.PositionField]
  },
  [Type.Vibration]: {
    label: Type[Type.Vibration],
    category: 'vibration',
    deviceTypes: [
      DeviceType.SVT220520P,
      DeviceType.SVT520C,
      DeviceType.SVT210510P,
      DeviceType.SVT510C,
      DeviceType.SVT210K,
      DeviceType.SVT210A
    ],
    properties: FeatureProperty.SVT_WIRELESS.properties,
    settings: MonitoringPointSettingsFieldConfig.Vibration.Fields
  },
  [Type.VibrationRotationSingleAxis]: {
    label: Type[Type.VibrationRotationSingleAxis],
    category: 'vibration',
    deviceTypes: [DeviceType.SVT220S1],
    properties: FeatureProperty.SVT_RS485.properties,
    settings: MonitoringPointSettingsFieldConfig.Vibration.Fields
  },
  [Type.VibrationRotation]: {
    label: Type[Type.VibrationRotation],
    category: 'vibration',
    deviceTypes: [DeviceType.SVT210S, DeviceType.SVT220S3, DeviceType.SVT510L, DeviceType.SVT210SU],
    properties: FeatureProperty.SVT_RS485.properties,
    settings: MonitoringPointSettingsFieldConfig.Vibration.Fields
  },
  [Type.VibrationAudio]: {
    label: Type[Type.VibrationAudio],
    category: 'vibration',
    deviceTypes: [DeviceType.SVT210SU],
    properties: FeatureProperty.SVT_AUDIO.properties,
    settings: MonitoringPointSettingsFieldConfig.Vibration.Fields
  },
  // [Type.Inclination]: {
  //   label: Type[Type.Inclination],
  //   category: 'inclination',
  //   deviceTypes: [DeviceType.SQ100, DeviceType.SQ110C]
  // },
  [Type.TopInclination]: {
    label: Type[Type.TopInclination],
    category: 'inclination',
    deviceTypes: [DeviceType.SQ100, DeviceType.SQ110C],
    properties: FeatureProperty.TopInclination.properties,
    settings: MonitoringPointSettingsFieldConfig.TopInclination
  },
  [Type.BaseInclination]: {
    label: Type[Type.BaseInclination],
    category: 'inclination',
    deviceTypes: [DeviceType.SQ100, DeviceType.SQ110C],
    properties: FeatureProperty.BaseInclination.properties,
    settings: MonitoringPointSettingsFieldConfig.BaseInclination
  },
  [Type.Pressure]: {
    label: Type[Type.Pressure],
    category: 'pressure',
    deviceTypes: [DeviceType.SPT510],
    properties: FeatureProperty.SPT.properties,
    settings: [MonitoringPointSettingsFieldConfig.PositionField]
  },
  [Type.Temperature]: {
    label: Type[Type.Temperature],
    category: 'temperature',
    deviceTypes: [DeviceType.ST100, DeviceType.ST101L, DeviceType.ST101S],
    properties: FeatureProperty.ST.properties,
    settings: [MonitoringPointSettingsFieldConfig.PositionField]
  },
  [Type.OilFiller]: {
    label: Type[Type.OilFiller],
    category: 'vibration',
    deviceTypes: [DeviceType.OilFiller],
    properties: FeatureProperty.OilFiller.properties,
    settings: []
  }
};

const get = (type: Type): Config => table[type];
const getLabel = (key: Type) => {
  const PREFIX = 'monitoring.point.type.';
  const type = get(key);
  return type ? `${PREFIX}${transformSnake2Dot(toSnake(type.label))}` : `${key}`;
};
const toOption = (type: Type) => ({
  value: type,
  label: getLabel(type)
});
const getDeviceTypes = (key: Type) => get(key)?.deviceTypes ?? [];
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

export type MonitoringPointType = Type;

export const MPTypeConfig = {
  getLabel,
  getProperties,
  getDeviceTypes,
  getSettings: (type: Type) => get(type)?.settings ?? [],
  getProcessId: (type: Type) => get(type)?.processId,
  isVirtual: (type: Type) => type === Type.FlangeBoltPreload,
  Category: {
    getTypes,
    getOptions: (categories: Config['category'][]) => {
      const set = new Set(categories);
      return (Object.keys(table) as unknown as Type[])
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
      Type.BoltLoosening,
      Type.BoltPreload,
      Type.AnchorPreload,
      Type.FlangeBoltPreload,
      Type.FlangeAnchorPreload
    ],
    corrosions: [Type.Corrosion, Type.HighTemperatureCorrosion, Type.UltraHighTemperatureCorrosion],
    vibrations: [
      Type.Vibration,
      Type.VibrationRotationSingleAxis,
      Type.VibrationRotation,
      Type.VibrationAudio
    ],
    Inclination: {
      getDisplacementKey: (type: Type) => (type === Type.TopInclination ? 'RADIAL' : 'AXIAL')
    }
  }
};

function getProperties({ type, properties = [] }: { type: Type; properties?: Property[] }) {
  const config = get(type);
  const dispalyProperties = config?.properties;
  if (!dispalyProperties || dispalyProperties.length === 0) {
    return properties
      .filter((p) => !!p.isShow)
      .sort((prev, crt) => prev.sort - crt.sort) as Feature.Property[];
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
      .filter((p) => !!p.fields) as Feature.Property[];
  }
}
