import { FeatureProperty } from 'domain/feature-property';
import { VibrationPropertyKey, Waveform, WaveformProperty } from '../types';
import { OMonitoringPoint } from 'domain/monitoring-point';

const amplitude: WaveformProperty = {
  key: 'mv',
  name: 'amplitude',
  precision: 2,
  unit: 'mv'
};

const tof: WaveformProperty = {
  key: 'tof',
  name: FeatureProperty.Tof.name,
  precision: FeatureProperty.Tof.precision,
  unit: FeatureProperty.Tof.unit
};

const WAVEFORM_CORROSION: Waveform = {
  dataType: 'waveform',
  meta: [
    FeatureProperty.DC.Thickness,
    { ...FeatureProperty.Temperature, key: 'temp' },
    FeatureProperty.Tof,
    {
      key: 'envTemp',
      name: 'rod.top.temperature',
      unit: '℃',
      precision: FeatureProperty.Temperature.precision
    },
    { ...FeatureProperty.SignalStrength, key: 'signalStrength' },
    { ...FeatureProperty.SignalQuality, key: 'signalQuality' }
  ],
  properties: [amplitude, tof],
  xAxis: FeatureProperty.Tof
};

const WAVEFORM_PRELOAD: Waveform = {
  dataType: 'waveform',
  meta: [
    FeatureProperty.SAS.Preload,
    FeatureProperty.SAS.Stress,
    FeatureProperty.Tof,
    FeatureProperty.Temperature,
    { ...FeatureProperty.SAS.Length, key: 'thickness' }
  ],
  properties: [amplitude, tof],
  xAxis: FeatureProperty.Tof
};

const waveformInclinationMeta = [
  { ...FeatureProperty.Inclination, key: 'mean_inclination' },
  { ...FeatureProperty.Pitch, key: 'mean_pitch' },
  { ...FeatureProperty.Roll, key: 'mean_roll' },
  { ...FeatureProperty.Waggle, key: 'mean_waggle' },
  FeatureProperty.Temperature
  // { key: 'odr', name: 'odr', precision: 1, hidden: true }
];
const direction: WaveformProperty = {
  key: 'dynamic_direction',
  name: FeatureProperty.TopInclination.Direction.name,
  precision: FeatureProperty.TopInclination.Direction.precision,
  unit: FeatureProperty.TopInclination.Direction.unit
};
const waggle: WaveformProperty = {
  key: 'dynamic_waggle',
  name: FeatureProperty.Waggle.name,
  precision: FeatureProperty.Waggle.precision,
  unit: FeatureProperty.Waggle.unit
};
const displacement: WaveformProperty = {
  key: 'dynamic_displacement',
  name: 'FIELD_DISPLACEMENT',
  precision: FeatureProperty.TopInclination.Displacement.precision,
  unit: FeatureProperty.TopInclination.Displacement.unit
};
const displacementEw: WaveformProperty = {
  key: 'dynamic_displacement_ew',
  name: 'FIELD_DISPLACEMENT_EW2',
  precision: FeatureProperty.TopInclination.Displacement.precision
};
const displacementNs: WaveformProperty = {
  key: 'dynamic_displacement_ns',
  name: 'FIELD_DISPLACEMENT_NS2',
  precision: FeatureProperty.TopInclination.Displacement.precision
};
const inclination: WaveformProperty = {
  key: 'dynamic_inclination',
  name: FeatureProperty.TopInclination.Inclination.name,
  precision: FeatureProperty.TopInclination.Inclination.precision,
  unit: FeatureProperty.TopInclination.Inclination.unit
};
const inclinationEw: WaveformProperty = {
  key: 'dynamic_inclination_ew',
  name: 'FIELD_INCLINATION_EW2',
  precision: FeatureProperty.TopInclination.Inclination.precision
};
const inclinationNs: WaveformProperty = {
  key: 'dynamic_inclination_ns',
  name: 'FIELD_INCLINATION_NS2',
  precision: FeatureProperty.TopInclination.Inclination.precision
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
          precision: FeatureProperty.TopInclination.Displacement.precision
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
          precision: FeatureProperty.Inclination.precision
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
          precision: FeatureProperty.TopInclination.Displacement.precision
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
          precision: FeatureProperty.Inclination.precision
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
      precision: FeatureProperty.SVT_WIRELESS.AccelerationRMS.precision,
      unit: FeatureProperty.SVT_WIRELESS.AccelerationRMS.unit
    },
    {
      key: 'accelerationFrequencyDomain',
      name: 'FIELD_ACCELERATION_FREQUENCY_DOMAIN',
      precision: FeatureProperty.SVT_WIRELESS.AccelerationRMS.precision,
      unit: FeatureProperty.SVT_WIRELESS.AccelerationRMS.unit
    },
    {
      key: 'velocityTimeDomain',
      name: 'FIELD_VELOCITY_TIME_DOMAIN',
      precision: FeatureProperty.SVT_WIRELESS.VelocityRMS.precision,
      unit: FeatureProperty.SVT_WIRELESS.VelocityRMS.unit
    },
    {
      key: 'velocityFrequencyDomain',
      name: 'FIELD_VELOCITY_FREQUENCY_DOMAIN',
      precision: FeatureProperty.SVT_WIRELESS.VelocityRMS.precision,
      unit: FeatureProperty.SVT_WIRELESS.VelocityRMS.unit
    },
    {
      key: 'displacementTimeDomain',
      name: 'FIELD_DISPLACEMENT_TIME_DOMAIN',
      precision: FeatureProperty.SVT_WIRELESS.DisplacementRMS.precision,
      unit: FeatureProperty.SVT_WIRELESS.DisplacementRMS.unit
    },
    {
      key: 'displacementFrequencyDomain',
      name: 'FIELD_DISPLACEMENT_FREQUENCY_DOMAIN',
      precision: FeatureProperty.SVT_WIRELESS.DisplacementRMS.precision,
      unit: FeatureProperty.SVT_WIRELESS.DisplacementRMS.unit
    }
  ]
};

export const PROPERTIES_WITH_ENVELOPE: VibrationPropertyKey[] = [
  'accelerationTimeDomain',
  'velocityTimeDomain',
  'displacementTimeDomain'
];

export enum WaveformMonitoringPointKey {
  Corrosion = OMonitoringPoint.Type.Corrosion,
  HighTemperatureCorrosion = OMonitoringPoint.Type.HighTemperatureCorrosion,
  UltraHighTemperatureCorrosion = OMonitoringPoint.Type.UltraHighTemperatureCorrosion,
  BoltPreload = OMonitoringPoint.Type.BoltPreload,
  AnchorPreload = OMonitoringPoint.Type.AnchorPreload,
  Vibration = OMonitoringPoint.Type.Vibration,
  VibrationRotationSingleAxis = OMonitoringPoint.Type.VibrationRotationSingleAxis,
  VibrationRotation = OMonitoringPoint.Type.VibrationRotation,
  TopInclination = OMonitoringPoint.Type.TopInclination,
  BaseInclination = OMonitoringPoint.Type.BaseInclination
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
