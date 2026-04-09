import {
  Property,
  Group,
  INCLINATION,
  PITCH,
  ROLL,
  TEMPERATURE
} from './common';

export const VELOCITY_RMS: Property = {
  key: 'vibration_severity',
  name: 'FIELD_VELOCITY_RMS',
  precision: 3,
  first: true,
  unit: 'mm/s',
  group: 'property.group.core'
};
const ACCLERATION_ENVELOPE: Property = {
  key: 'enveloping_pk2pk',
  name: 'FIELD_ACCLERATION_ENVELOPE',
  precision: 3,
  first: true,
  unit: 'gE',
  group: 'property.group.core'
};
export const ACCELERATION_RMS: Property = {
  key: 'acceleration_rms',
  name: 'FIELD_ACCELERATION_RMS',
  precision: 3,
  unit: 'm/s²',
  group: 'property.group.timeDomain'
};
const ACCLERATION_PEAK: Property = {
  key: 'acceleration_peak',
  name: 'FIELD_ACCLERATION_PEAK',
  precision: 3,
  unit: 'm/s²',
  group: 'property.group.timeDomain'
};
const DISPLACEMENT_PEAK_TO_PEAK: Property = {
  key: 'displacement_peak_difference',
  name: 'FIELD_DISPLACEMENT_PEAK_TO_PEAK',
  precision: 3,
  unit: 'μm',
  group: 'property.group.timeDomain'
};
export const DISPLACEMENT_RMS: Property = {
  key: 'displacement',
  name: 'FIELD_DISPLACEMENT_RMS',
  precision: 3,
  unit: 'μm',
  group: 'property.group.timeDomain'
};
const FREQUENCY: Property = {
  key: 'fft_frequency',
  name: 'FIELD_FREQUENCY',
  precision: 1,
  unit: 'Hz',
  group: 'property.group.core',
  onlyShowFirstField: true
};
const CREST_FACTOR: Property = {
  key: 'crest_factor',
  name: 'FIELD_CREST_FACTOR',
  precision: 3,
  group: 'property.group.statistics'
};
const PULSE_FACTOR: Property = {
  key: 'pulse_factor',
  name: 'FIELD_PULSE_FACTOR',
  precision: 3,
  group: 'property.group.statistics'
};
const MARGIN_FACTOR: Property = {
  key: 'margin_factor',
  name: 'FIELD_MARGIN_FACTOR',
  precision: 3,
  group: 'property.group.statistics'
};
const KURTOSIS: Property = {
  key: 'kurtosis',
  name: 'FIELD_KURTOSIS',
  precision: 3,
  group: 'property.group.statistics'
};
const KURTOSIS_NORM: Property = {
  key: 'kurtosis_norm',
  name: 'FIELD_KURTOSIS_NORM',
  precision: 3,
  group: 'property.group.statistics'
};
const SKWENESS: Property = {
  key: 'skewness',
  name: 'FIELD_SKWENESS',
  precision: 3,
  group: 'property.group.statistics'
};
const SKWENESS_NORM: Property = {
  key: 'skewness_norm',
  name: 'FIELD_SKWENESS_NORM',
  precision: 3,
  group: 'property.group.statistics'
};
const HALF_HARMONIC: Property = {
  key: 'fft_value_0',
  name: 'FIELD_HALF_HARMONIC',
  precision: 3,
  unit: 'm/s²',
  group: 'property.group.frequency'
};
const FIRST_HARMONIC: Property = {
  key: 'fft_value_1',
  name: 'FIELD_FIRST_HARMONIC',
  precision: 3,
  unit: 'm/s²',
  group: 'property.group.frequency'
};
const SECOND_HARMONIC: Property = {
  key: 'fft_value_2',
  name: 'FIELD_SECOND_HARMONIC',
  precision: 3,
  unit: 'm/s²',
  group: 'property.group.frequency'
};
const THIRD_HARMONIC: Property = {
  key: 'fft_value_3',
  name: 'FIELD_THIRD_HARMONIC',
  precision: 3,
  unit: 'm/s²',
  group: 'property.group.frequency'
};
const VARIANCE: Property = {
  key: 'acc_var',
  name: 'FIELD_VARIANCE',
  precision: 3,
  group: 'property.group.statistics'
};
const SPECTRUM_VARIANCE: Property = {
  key: 'spectrum_variance',
  name: 'FIELD_SPECTRUM_VARIANCE',
  precision: 3,
  group: 'property.group.frequency'
};
const SPECTRUM_MEAN: Property = {
  key: 'spectrum_mean',
  name: 'FIELD_SPECTRUM_MEAN',
  precision: 3,
  group: 'property.group.frequency'
};
const PPECTRUM_RMS: Property = {
  key: 'spectrum_rms',
  name: 'FIELD_PPECTRUM_RMS',
  precision: 3,
  group: 'property.group.frequency'
};
const RPM: Property = {
  key: 'rpm',
  name: 'FIELD_RPM',
  precision: 3,
  group: 'property.group.core'
};
const SOUND_PRESSURE_LEVEL: Property = {
  key: 'pressure_level',
  name: 'FIELD_SOUND_PRESSURE_LEVEL',
  precision: 3,
  group: 'property.group.core'
};
const ENERGY_RATIO: Property = {
  key: 'energy_ratio',
  name: 'FIELD_ENERGY_RATIO',
  precision: 3,
  group: 'property.group.core'
};
const DOMINANT_FREQUENCY: Property = {
  key: 'dominant_frequency',
  name: 'FIELD_DOMINANT_FREQUENCY',
  precision: 3,
  group: 'property.group.core'
};
const STATIONARITY: Property = {
  key: 'stationarity',
  name: 'FIELD_STATIONARITY',
  precision: 3,
  group: 'property.group.core'
};

export const SVT_WIRELESS = {
  VelocityRMS: VELOCITY_RMS,
  AccelerationRMS: ACCELERATION_RMS,
  DisplacementRMS: DISPLACEMENT_RMS,
  properties: [
    VELOCITY_RMS,
    ACCLERATION_ENVELOPE,
    { ...TEMPERATURE, group: 'property.group.core' as Group },
    FREQUENCY,
    ACCELERATION_RMS,
    ACCLERATION_PEAK,
    DISPLACEMENT_RMS,
    DISPLACEMENT_PEAK_TO_PEAK,
    FIRST_HARMONIC,
    SECOND_HARMONIC,
    THIRD_HARMONIC,
    HALF_HARMONIC,
    SPECTRUM_MEAN,
    SPECTRUM_VARIANCE,
    PPECTRUM_RMS,
    SKWENESS,
    SKWENESS_NORM,
    KURTOSIS,
    KURTOSIS_NORM,
    CREST_FACTOR,
    PULSE_FACTOR,
    MARGIN_FACTOR,
    VARIANCE,
    { ...INCLINATION, group: 'property.group.skew' as Group },
    { ...PITCH, group: 'property.group.skew' as Group },
    { ...ROLL, group: 'property.group.skew' as Group }
  ]
};

export const SVT_RS485 = {
  properties: [
    VELOCITY_RMS,
    ACCLERATION_ENVELOPE,
    { ...TEMPERATURE, group: 'property.group.core' as Group },
    FREQUENCY,
    ACCLERATION_PEAK,
    DISPLACEMENT_PEAK_TO_PEAK,
    RPM
  ]
};

export const SVT_AUDIO = {
  properties: [
    VELOCITY_RMS,
    ACCLERATION_ENVELOPE,
    { ...TEMPERATURE, group: 'property.group.core' as Group },
    FREQUENCY,
    SOUND_PRESSURE_LEVEL,
    ENERGY_RATIO,
    DOMINANT_FREQUENCY,
    STATIONARITY,
    ACCLERATION_PEAK,
    DISPLACEMENT_PEAK_TO_PEAK,
    RPM
  ]
};
