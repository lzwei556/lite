import {
  DisplayProperty,
  DisplayPropertyGroup,
  INCLINATION,
  PITCH,
  ROLL,
  TEMPERATURE
} from './common';

export const VELOCITY_RMS: DisplayProperty = {
  key: 'vibration_severity',
  name: 'FIELD_VELOCITY_RMS',
  precision: 3,
  first: true,
  unit: 'mm/s',
  group: 'property.group.core'
};
const ACCLERATION_ENVELOPE: DisplayProperty = {
  key: 'enveloping_pk2pk',
  name: 'FIELD_ACCLERATION_ENVELOPE',
  precision: 3,
  first: true,
  unit: 'gE',
  group: 'property.group.core'
};
export const ACCELERATION_RMS: DisplayProperty = {
  key: 'acceleration_rms',
  name: 'FIELD_ACCELERATION_RMS',
  precision: 3,
  unit: 'm/s²',
  group: 'property.group.timeDomain'
};
const ACCLERATION_PEAK: DisplayProperty = {
  key: 'acceleration_peak',
  name: 'FIELD_ACCLERATION_PEAK',
  precision: 3,
  unit: 'm/s²',
  group: 'property.group.timeDomain'
};
const DISPLACEMENT_PEAK_TO_PEAK: DisplayProperty = {
  key: 'displacement_peak_difference',
  name: 'FIELD_DISPLACEMENT_PEAK_TO_PEAK',
  precision: 3,
  unit: 'μm',
  group: 'property.group.timeDomain'
};
export const DISPLACEMENT_RMS: DisplayProperty = {
  key: 'displacement',
  name: 'FIELD_DISPLACEMENT_RMS',
  precision: 3,
  unit: 'μm',
  group: 'property.group.timeDomain'
};
const FREQUENCY: DisplayProperty = {
  key: 'fft_frequency',
  name: 'FIELD_FREQUENCY',
  precision: 1,
  unit: 'Hz',
  group: 'property.group.core',
  onlyShowFirstField: true
};
const CREST_FACTOR: DisplayProperty = {
  key: 'crest_factor',
  name: 'FIELD_CREST_FACTOR',
  precision: 3,
  group: 'property.group.statistics'
};
const PULSE_FACTOR: DisplayProperty = {
  key: 'pulse_factor',
  name: 'FIELD_PULSE_FACTOR',
  precision: 3,
  group: 'property.group.statistics'
};
const MARGIN_FACTOR: DisplayProperty = {
  key: 'margin_factor',
  name: 'FIELD_MARGIN_FACTOR',
  precision: 3,
  group: 'property.group.statistics'
};
const KURTOSIS: DisplayProperty = {
  key: 'kurtosis',
  name: 'FIELD_KURTOSIS',
  precision: 3,
  group: 'property.group.statistics'
};
const KURTOSIS_NORM: DisplayProperty = {
  key: 'kurtosis_norm',
  name: 'FIELD_KURTOSIS_NORM',
  precision: 3,
  group: 'property.group.statistics'
};
const SKWENESS: DisplayProperty = {
  key: 'skewness',
  name: 'FIELD_SKWENESS',
  precision: 3,
  group: 'property.group.statistics'
};
const SKWENESS_NORM: DisplayProperty = {
  key: 'skewness_norm',
  name: 'FIELD_SKWENESS_NORM',
  precision: 3,
  group: 'property.group.statistics'
};
const HALF_HARMONIC: DisplayProperty = {
  key: 'fft_value_0',
  name: 'FIELD_HALF_HARMONIC',
  precision: 3,
  unit: 'm/s²',
  group: 'property.group.frequency'
};
const FIRST_HARMONIC: DisplayProperty = {
  key: 'fft_value_1',
  name: 'FIELD_FIRST_HARMONIC',
  precision: 3,
  unit: 'm/s²',
  group: 'property.group.frequency'
};
const SECOND_HARMONIC: DisplayProperty = {
  key: 'fft_value_2',
  name: 'FIELD_SECOND_HARMONIC',
  precision: 3,
  unit: 'm/s²',
  group: 'property.group.frequency'
};
const THIRD_HARMONIC: DisplayProperty = {
  key: 'fft_value_3',
  name: 'FIELD_THIRD_HARMONIC',
  precision: 3,
  unit: 'm/s²',
  group: 'property.group.frequency'
};
const VARIANCE: DisplayProperty = {
  key: 'acc_var',
  name: 'FIELD_VARIANCE',
  precision: 3,
  group: 'property.group.statistics'
};
const SPECTRUM_VARIANCE: DisplayProperty = {
  key: 'spectrum_variance',
  name: 'FIELD_SPECTRUM_VARIANCE',
  precision: 3,
  group: 'property.group.frequency'
};
const SPECTRUM_MEAN: DisplayProperty = {
  key: 'spectrum_mean',
  name: 'FIELD_SPECTRUM_MEAN',
  precision: 3,
  group: 'property.group.frequency'
};
const PPECTRUM_RMS: DisplayProperty = {
  key: 'spectrum_rms',
  name: 'FIELD_PPECTRUM_RMS',
  precision: 3,
  group: 'property.group.frequency'
};
const RPM: DisplayProperty = {
  key: 'rpm',
  name: 'FIELD_RPM',
  precision: 3,
  group: 'property.group.core'
};
const SOUND_PRESSURE_LEVEL: DisplayProperty = {
  key: 'pressure_level',
  name: 'FIELD_SOUND_PRESSURE_LEVEL',
  precision: 3,
  group: 'property.group.core'
};
const ENERGY_RATIO: DisplayProperty = {
  key: 'energy_ratio',
  name: 'FIELD_ENERGY_RATIO',
  precision: 3,
  group: 'property.group.core'
};
const DOMINANT_FREQUENCY: DisplayProperty = {
  key: 'dominant_frequency',
  name: 'FIELD_DOMINANT_FREQUENCY',
  precision: 3,
  group: 'property.group.core'
};
const STATIONARITY: DisplayProperty = {
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
    { ...TEMPERATURE, group: 'property.group.core' as DisplayPropertyGroup },
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
    { ...INCLINATION, group: 'property.group.skew' as DisplayPropertyGroup },
    { ...PITCH, group: 'property.group.skew' as DisplayPropertyGroup },
    { ...ROLL, group: 'property.group.skew' as DisplayPropertyGroup }
  ]
};

export const SVT_RS485 = {
  properties: [
    VELOCITY_RMS,
    ACCLERATION_ENVELOPE,
    { ...TEMPERATURE, group: 'property.group.core' as DisplayPropertyGroup },
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
    { ...TEMPERATURE, group: 'property.group.core' as DisplayPropertyGroup },
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
