export type Group = `property.group.${
  | 'core'
  | 'timeDomain'
  | 'frequency'
  | 'statistics'
  | 'skew'}`;

type PropertyCommon = {
  key: string;
  name: string;
  first?: boolean;
  precision: number;
  unit?: string;
  unit2?: string;
  interval?: number;
  defaultFirstFieldKey?: string;
  group?: Group;
  onlyShowFirstField?: boolean;
  min?: number;
  hidden?: boolean;
};
type Field = { name: string; key: string; dataIndex: number; first?: boolean; alias?: string };
export type Property = PropertyCommon & { fields?: Field[] };
export type FieldProperty = PropertyCommon & { field?: Field };

export const TEMPERATURE: Property = {
  key: 'temperature',
  name: 'FIELD_TEMPERATURE',
  first: true,
  precision: 1,
  unit: '℃',
  unit2: '°C'
};

export const TOF: Property = {
  key: 'tof',
  name: 'FIELD_TOF',
  precision: 0,
  unit: 'ns',
  interval: 600
};
export const SIGNAL_STRENGTH: Property = {
  key: 'signal_strength',
  name: 'FIELD_SIGNAL_STRENGTH',
  precision: 1
};
export const SIGNAL_QUALITY: Property = {
  key: 'signal_quality',
  name: 'FIELD_SIGNAL_QUALITY',
  precision: 1
};

export const INCLINATION: Property = {
  key: 'inclination',
  name: 'FIELD_INCLINATION',
  precision: 4,
  unit: '°'
};
export const PITCH: Property = {
  key: 'pitch',
  name: 'FIELD_PITCH',
  precision: 4,
  unit: '°'
};
export const ROLL: Property = {
  key: 'roll',
  name: 'FIELD_ROLL',
  precision: 4,
  unit: '°'
};
export const WAGGLE: Property = {
  key: 'waggle',
  name: 'FIELD_WAGGLE',
  precision: 3,
  unit: 'g'
};
