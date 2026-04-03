export type DisplayPropertyGroup = `property.group.${
  | 'core'
  | 'timeDomain'
  | 'frequency'
  | 'statistics'
  | 'skew'}`;

type Property = {
  key: string;
  name: string;
  first?: boolean;
  precision: number;
  unit?: string;
  unit2?: string;
  interval?: number;
  defaultFirstFieldKey?: string;
  group?: DisplayPropertyGroup;
  onlyShowFirstField?: boolean;
  min?: number;
  hidden?: boolean;
};
type Field = { name: string; key: string; dataIndex: number; first?: boolean; alias?: string };
export type DisplayProperty = Property & { fields?: Field[] };
export type DisaplyFieldProperty = Property & { field?: Field };

export const TEMPERATURE: DisplayProperty = {
  key: 'temperature',
  name: 'FIELD_TEMPERATURE',
  first: true,
  precision: 1,
  unit: '℃',
  unit2: '°C'
};

export const TOF: DisplayProperty = {
  key: 'tof',
  name: 'FIELD_TOF',
  precision: 0,
  unit: 'ns',
  interval: 600
};
export const SIGNAL_STRENGTH: DisplayProperty = {
  key: 'signal_strength',
  name: 'FIELD_SIGNAL_STRENGTH',
  precision: 1
};
export const SIGNAL_QUALITY: DisplayProperty = {
  key: 'signal_quality',
  name: 'FIELD_SIGNAL_QUALITY',
  precision: 1
};

export const INCLINATION: DisplayProperty = {
  key: 'inclination',
  name: 'FIELD_INCLINATION',
  precision: 4,
  unit: '°'
};
export const PITCH: DisplayProperty = {
  key: 'pitch',
  name: 'FIELD_PITCH',
  precision: 4,
  unit: '°'
};
export const ROLL: DisplayProperty = {
  key: 'roll',
  name: 'FIELD_ROLL',
  precision: 4,
  unit: '°'
};
export const WAGGLE: DisplayProperty = {
  key: 'waggle',
  name: 'FIELD_WAGGLE',
  precision: 3,
  unit: 'g'
};
