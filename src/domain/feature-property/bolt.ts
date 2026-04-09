import {
  Property,
  TEMPERATURE as COMMON_TEMPERATURE,
  TOF,
  SIGNAL_STRENGTH,
  SIGNAL_QUALITY,
  WAGGLE,
  TEMPERATURE
} from './common';

const LOOSENING_ANGLE: Property = {
  key: 'loosening_angle',
  name: 'FIELD_LOOSENING_ANGLE',
  first: true,
  precision: 1,
  interval: 0.5,
  unit: '°'
};
const MEASUREMENT_INDEX: Property = {
  key: 'measurement_index',
  name: 'FIELD_MEASUREMENT_INDEX',
  precision: 3
};
const MOTION: Property = {
  key: 'motion',
  name: 'FIELD_MOTION',
  precision: 3
};
const ATTITUDE_INDEX: Property = {
  key: 'attitude',
  name: 'FIELD_ATTITUDE_INDEX',
  precision: 4
};

export const SA = {
  LooseningAngle: LOOSENING_ANGLE,
  MeasurementIndex: MEASUREMENT_INDEX,
  Motion: MOTION,
  AttitudeIndex: ATTITUDE_INDEX,
  properties: [
    LOOSENING_ANGLE,
    MEASUREMENT_INDEX,
    MOTION,
    ATTITUDE_INDEX,
    { ...COMMON_TEMPERATURE, first: false }
  ]
};

const PRELOAD: Property = {
  key: 'preload',
  name: 'FIELD_PRELOAD',
  first: true,
  interval: 20,
  precision: 0,
  unit: 'kN'
};

const STRESS: Property = {
  key: 'pressure',
  name: 'FIELD_STRESS',
  first: true,
  interval: 20,
  precision: 0,
  unit: 'MPa'
};

const LENGTH: Property = {
  key: 'length',
  name: 'FIELD_LENGTH',
  interval: 1,
  precision: 1,
  unit: 'mm'
};

export const SAS = {
  Preload: PRELOAD,
  Stress: STRESS,
  Length: LENGTH,
  Tof: TOF,
  properties: [
    PRELOAD,
    STRESS,
    LENGTH,
    {
      ...COMMON_TEMPERATURE,
      key: 'bolt_temperature',
      name: 'FIELD_BOLT_TEMPERATURE'
    },
    TOF,
    {
      key: 'defect_location',
      name: 'FIELD_DEFECT_LOCATION',
      precision: 3,
      unit: 'mm'
    },
    {
      key: 'defect_level',
      name: 'FIELD_DEFECT_LEVEL',
      precision: 3
    },
    SIGNAL_STRENGTH,
    SIGNAL_QUALITY,
    {
      key: 'attitude',
      name: 'FIELD_BOLT_ATTITUDE',
      precision: 3,
      unit: 'g'
    }
  ]
};

export const TopInclination_DISPLACEMENT_COMBINED: Property = {
  key: 'displacement_combined',
  first: true,
  name: 'FIELD_DISPLACEMENT_COMBINED',
  precision: 3,
  unit: 'mm',
  defaultFirstFieldKey: 'displacement_radial'
};
export const TopInclination_INCLINATION_COMBINED: Property = {
  key: 'inclination_combined',
  first: true,
  name: 'FIELD_INCLINATION_COMBINED',
  precision: 4,
  unit: '°',
  defaultFirstFieldKey: 'inclination_radial'
};
const BaseInclination_DISPLACEMENT_COMBINED: Property = {
  key: 'displacement_combined',
  first: true,
  name: 'FIELD_DISPLACEMENT_COMBINED',
  precision: 3,
  unit: 'mm',
  defaultFirstFieldKey: 'displacement_axial'
};
const BaseInclination_INCLINATION_COMBINED: Property = {
  key: 'inclination_combined',
  first: true,
  name: 'FIELD_INCLINATION_COMBINED',
  precision: 4,
  unit: '°',
  defaultFirstFieldKey: 'inclination_axial'
};
export const DIRECTION: Property = {
  key: 'direction',
  first: true,
  name: 'FIELD_DIRECTION',
  precision: 3,
  unit: '°'
};

export const TopInclination = {
  Direction: DIRECTION,
  Displacement: TopInclination_DISPLACEMENT_COMBINED,
  Inclination: TopInclination_INCLINATION_COMBINED,
  properties: [
    TopInclination_DISPLACEMENT_COMBINED,
    TopInclination_INCLINATION_COMBINED,
    DIRECTION,
    WAGGLE,
    { ...TEMPERATURE, first: false }
  ]
};

export const BaseInclination = {
  properties: [
    BaseInclination_DISPLACEMENT_COMBINED,
    BaseInclination_INCLINATION_COMBINED,
    DIRECTION,
    WAGGLE,
    { ...TEMPERATURE, first: false }
  ]
};
