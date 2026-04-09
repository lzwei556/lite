import { DataType } from './use-services';
import * as Axis from 'domain/axis';
import * as Feature from 'domain/feature-property';

export type Property = {
  key: string;
  name: string;
  precision: number;
  sort: number;
  unit: string;
  fields: { key: string; name: string; dataIndex: number; value: number }[];
  data: { [propName: string]: number };
  isShow: boolean;
};

export type FeatureDataDTO = {
  timestamp: number;
  values: Property[];
}[];

// waveform

type UltrasoundPropertyKey = 'mv' | 'tof';
export type WaveformUltrasound = { [Key in UltrasoundPropertyKey]: number[] };

type InclinationPropertyKey =
  | 'dynamic_direction'
  | 'dynamic_displacement'
  | 'dynamic_displacement_axial'
  | 'dynamic_displacement_ew'
  | 'dynamic_displacement_ns'
  | 'dynamic_displacement_radial'
  | 'dynamic_inclination'
  | 'dynamic_inclination_axial'
  | 'dynamic_inclination_ew'
  | 'dynamic_inclination_ns'
  | 'dynamic_inclination_radial'
  | 'dynamic_pitch'
  | 'dynamic_roll'
  | 'dynamic_waggle';
export type WaveformInclination = { [Key in InclinationPropertyKey]: number[] };

export type WaveformVibration = {
  frequency: number;
  fullScale: number;
  highEnvelopes: number[];
  lowEnvelopes: number[];
  number: number;
  range: number;
  values: number[];
  xAxis?: number[];
  xAxisUnit: string;
  yAxisUnit: string;
};

export type WaveformData = {
  timestamp: number;
  values: (WaveformUltrasound | WaveformInclination | WaveformVibration) & {
    metadata?: { [key: string]: number };
  };
};

export type VibrationPropertyKey =
  | 'originalDomain'
  | `${'acceleration' | 'velocity' | 'displacement'}${'TimeDomain' | 'FrequencyDomain'}`;

export type WaveformProperty = {
  key: UltrasoundPropertyKey | InclinationPropertyKey | VibrationPropertyKey;
  fields?: WaveformProperty[];
  name: string;
  precision: number;
  unit?: string;
};

export type Waveform = {
  dataType: DataType;
  meta?: readonly Feature.Types.Property[];
  properties: WaveformProperty[];
  xAxis?: Feature.Types.Property;
};

export type VibrationWaveformFilters = {
  calculate: VibrationPropertyKey;
  dimension: Axis.Option['value'];
};
