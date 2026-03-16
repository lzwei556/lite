import {
  ACCELERATION_RMS,
  DIRECTION,
  DISPLACEMENT_RMS,
  INCLINATION,
  LENGTH,
  PITCH,
  PRELOAD,
  PRESSURE,
  ROLL,
  SIGNAL_QUALITY,
  SIGNAL_STRENGTH,
  TEMPERATURE,
  THICKNESS,
  TOF,
  TopInclination_DISPLACEMENT_COMBINED,
  TopInclination_INCLINATION_COMBINED,
  VELOCITY_RMS,
  WAGGLE
} from 'common/characteristic-data';
import { VibrationPropertyKey, Waveform, WaveformProperty } from '../types';
import { MonitoringPointType } from 'common';

const amplitude: WaveformProperty = {
  key: 'mv',
  name: 'amplitude',
  precision: 2,
  unit: 'mv'
};

const tof: WaveformProperty = {
  key: 'tof',
  name: TOF.name,
  precision: TOF.precision,
  unit: TOF.unit
};

const WAVEFORM_CORROSION: Waveform = {
  dataType: 'waveform',
  meta: [
    THICKNESS,
    { ...TEMPERATURE, key: 'temp' },
    TOF,
    {
      key: 'envTemp',
      name: 'corrosion.rod-top.temperature',
      unit: '℃',
      precision: TEMPERATURE.precision
    },
    { ...SIGNAL_STRENGTH, key: 'sigStrength' },
    { ...SIGNAL_QUALITY, key: 'signalQuality' }
    // { ...CORROSION_RATE, key: 'shortCorrosionRate', hidden: true },
    // { ...CORROSION_RATE, key: 'longCorrosionRate', hidden: true },
    // { name: 'samples', key: 'samples', precision: 1, hidden: true }
  ],
  properties: [amplitude, tof],
  xAxis: TOF
};

const WAVEFORM_PRELOAD: Waveform = {
  dataType: 'waveform',
  meta: [PRELOAD, PRESSURE, TOF, TEMPERATURE, { ...LENGTH, key: 'thickness' }],
  properties: [amplitude, tof],
  xAxis: TOF
};

const waveformInclinationMeta = [
  { ...INCLINATION, key: 'mean_inclination' },
  { ...PITCH, key: 'mean_pitch' },
  { ...ROLL, key: 'mean_roll' },
  { ...WAGGLE, key: 'mean_waggle' },
  TEMPERATURE
  // { key: 'odr', name: 'odr', precision: 1, hidden: true }
];
const direction: WaveformProperty = {
  key: 'dynamic_direction',
  name: DIRECTION.name,
  precision: DIRECTION.precision,
  unit: DIRECTION.unit
};
const waggle: WaveformProperty = {
  key: 'dynamic_waggle',
  name: WAGGLE.name,
  precision: WAGGLE.precision,
  unit: WAGGLE.unit
};
const displacement: WaveformProperty = {
  key: 'dynamic_displacement',
  name: 'FIELD_DISPLACEMENT',
  precision: TopInclination_DISPLACEMENT_COMBINED.precision,
  unit: TopInclination_DISPLACEMENT_COMBINED.unit
};
const displacementEw: WaveformProperty = {
  key: 'dynamic_displacement_ew',
  name: 'FIELD_DISPLACEMENT_EW2',
  precision: TopInclination_DISPLACEMENT_COMBINED.precision
};
const displacementNs: WaveformProperty = {
  key: 'dynamic_displacement_ns',
  name: 'FIELD_DISPLACEMENT_NS2',
  precision: TopInclination_DISPLACEMENT_COMBINED.precision
};
const inclination: WaveformProperty = {
  key: 'dynamic_inclination',
  name: TopInclination_INCLINATION_COMBINED.name,
  precision: TopInclination_INCLINATION_COMBINED.precision,
  unit: TopInclination_INCLINATION_COMBINED.unit
};
const inclinationEw: WaveformProperty = {
  key: 'dynamic_inclination_ew',
  name: 'FIELD_INCLINATION_EW2',
  precision: TopInclination_INCLINATION_COMBINED.precision
};
const inclinationNs: WaveformProperty = {
  key: 'dynamic_inclination_ns',
  name: 'FIELD_INCLINATION_NS2',
  precision: TopInclination_INCLINATION_COMBINED.precision
};

const WAVEFORM_INCLINATION_TOP: Waveform = {
  dataType: 'raw',
  meta: waveformInclinationMeta,
  properties: [
    direction,
    {
      ...displacement,
      fields: [
        {
          key: 'dynamic_displacement_radial',
          name: 'FIELD_DISPLACEMENT_RADIAL2',
          precision: TopInclination_DISPLACEMENT_COMBINED.precision
        },
        displacementEw,
        displacementNs
      ]
    },
    {
      ...inclination,
      fields: [
        {
          key: 'dynamic_inclination_radial',
          name: 'FIELD_INCLINATION_RADIAL2',
          precision: INCLINATION.precision
        },
        inclinationEw,
        inclinationNs
      ]
    },
    waggle
  ]
};

const WAVEFORM_INCLINATION_BASE: Waveform = {
  dataType: 'raw',
  meta: waveformInclinationMeta,
  properties: [
    direction,
    {
      ...displacement,
      fields: [
        {
          key: 'dynamic_displacement_axial',
          name: 'FIELD_DISPLACEMENT_AXIAL2',
          precision: TopInclination_DISPLACEMENT_COMBINED.precision
        },
        displacementEw,
        displacementNs
      ]
    },
    {
      ...inclination,
      fields: [
        {
          key: 'dynamic_inclination_axial',
          name: 'FIELD_INCLINATION_AXIAL2',
          precision: INCLINATION.precision
        },
        inclinationEw,
        inclinationNs
      ]
    },
    waggle
  ]
};

const WAVEFORM_VIBRATION: Waveform = {
  dataType: 'raw',
  properties: [
    {
      key: 'originalDomain',
      name: 'FIELD_ORIGINAL_DOMAIN',
      precision: 1,
      unit: ''
    },
    {
      key: 'accelerationTimeDomain',
      name: 'FIELD_ACCELERATION_TIME_DOMAIN',
      precision: ACCELERATION_RMS.precision,
      unit: ACCELERATION_RMS.unit
    },
    {
      key: 'accelerationFrequencyDomain',
      name: 'FIELD_ACCELERATION_FREQUENCY_DOMAIN',
      precision: ACCELERATION_RMS.precision,
      unit: ACCELERATION_RMS.unit
    },
    {
      key: 'velocityTimeDomain',
      name: 'FIELD_VELOCITY_TIME_DOMAIN',
      precision: VELOCITY_RMS.precision,
      unit: VELOCITY_RMS.unit
    },
    {
      key: 'velocityFrequencyDomain',
      name: 'FIELD_VELOCITY_FREQUENCY_DOMAIN',
      precision: VELOCITY_RMS.precision,
      unit: VELOCITY_RMS.unit
    },
    {
      key: 'displacementTimeDomain',
      name: 'FIELD_DISPLACEMENT_TIME_DOMAIN',
      precision: DISPLACEMENT_RMS.precision,
      unit: DISPLACEMENT_RMS.unit
    },
    {
      key: 'displacementFrequencyDomain',
      name: 'FIELD_DISPLACEMENT_FREQUENCY_DOMAIN',
      precision: DISPLACEMENT_RMS.precision,
      unit: DISPLACEMENT_RMS.unit
    }
  ]
};

export const PROPERTIES_WITH_ENVELOPE: VibrationPropertyKey[] = [
  'accelerationTimeDomain',
  'velocityTimeDomain',
  'displacementTimeDomain'
];

export enum WaveformMonitoringPointKey {
  Corrosion = MonitoringPointType.Value.Corrosion,
  HighTemperatureCorrosion = MonitoringPointType.Value['High-Temperature'],
  UltraHighTemperatureCorrosion = MonitoringPointType.Value['Ultra-High-Temperature'],
  BoltPreload = MonitoringPointType.Value.PreloadBolt,
  AnchorPreload = MonitoringPointType.Value.PreloadAnchor,
  Vibration = MonitoringPointType.Value.Vibration,
  VibrationRotationSingleAxis = MonitoringPointType.Value['VibrationRotationSingle-Axis'],
  VibrationRotation = MonitoringPointType.Value.VibrationRotation,
  TopInclination = MonitoringPointType.Value.InclinationTop,
  BaseInclination = MonitoringPointType.Value.InclinationBase
}

export const monitoringPointTypeWaveformMap: Record<WaveformMonitoringPointKey, Waveform> = {
  [WaveformMonitoringPointKey.Corrosion]: WAVEFORM_CORROSION,
  [WaveformMonitoringPointKey.HighTemperatureCorrosion]: WAVEFORM_CORROSION,
  [WaveformMonitoringPointKey.UltraHighTemperatureCorrosion]: WAVEFORM_CORROSION,
  [WaveformMonitoringPointKey.BoltPreload]: WAVEFORM_PRELOAD,
  [WaveformMonitoringPointKey.AnchorPreload]: WAVEFORM_PRELOAD,
  [WaveformMonitoringPointKey.Vibration]: WAVEFORM_VIBRATION,
  [WaveformMonitoringPointKey.VibrationRotationSingleAxis]: WAVEFORM_VIBRATION,
  [WaveformMonitoringPointKey.VibrationRotation]: WAVEFORM_VIBRATION,
  [WaveformMonitoringPointKey.TopInclination]: WAVEFORM_INCLINATION_TOP,
  [WaveformMonitoringPointKey.BaseInclination]: WAVEFORM_INCLINATION_BASE
};
