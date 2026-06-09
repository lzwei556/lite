import * as Feature from 'domains/feature-property';
import { VibrationPropertyKey, Waveform, WaveformProperty } from '../types';
import * as MonitoringPoint from 'domains/monitoring-point';

const amplitude: WaveformProperty = {
  key: 'mv',
  name: 'amplitude',
  precision: 2,
  unit: 'mv'
};

const tof: WaveformProperty = {
  key: 'tof',
  name: Feature.Property.Tof.name,
  precision: Feature.Property.Tof.precision,
  unit: Feature.Property.Tof.unit
};

const WAVEFORM_CORROSION: Waveform = {
  dataType: 'waveform',
  meta: [
    Feature.Property.DC.Thickness,
    { ...Feature.Property.Temperature, key: 'temp' },
    Feature.Property.Tof,
    {
      key: 'envTemp',
      name: 'rod.top.temperature',
      unit: '℃',
      precision: Feature.Property.Temperature.precision
    },
    { ...Feature.Property.SignalStrength, key: 'signalStrength' },
    { ...Feature.Property.SignalQuality, key: 'signalQuality' }
  ],
  properties: [amplitude, tof],
  xAxis: Feature.Property.Tof
};

const WAVEFORM_PRELOAD: Waveform = {
  dataType: 'waveform',
  meta: [
    Feature.Property.SAS.Preload,
    Feature.Property.SAS.Stress,
    Feature.Property.Tof,
    Feature.Property.Temperature,
    { ...Feature.Property.SAS.Length, key: 'thickness' }
  ],
  properties: [amplitude, tof],
  xAxis: Feature.Property.Tof
};

const waveformInclinationMeta = [
  { ...Feature.Property.Inclination, key: 'mean_inclination' },
  { ...Feature.Property.Pitch, key: 'mean_pitch' },
  { ...Feature.Property.Roll, key: 'mean_roll' },
  { ...Feature.Property.Waggle, key: 'mean_waggle' },
  Feature.Property.Temperature
  // { key: 'odr', name: 'odr', precision: 1, hidden: true }
];
const direction: WaveformProperty = {
  key: 'dynamic_direction',
  name: Feature.Property.TopInclination.Direction.name,
  precision: Feature.Property.TopInclination.Direction.precision,
  unit: Feature.Property.TopInclination.Direction.unit
};
const waggle: WaveformProperty = {
  key: 'dynamic_waggle',
  name: Feature.Property.Waggle.name,
  precision: Feature.Property.Waggle.precision,
  unit: Feature.Property.Waggle.unit
};
const displacement: WaveformProperty = {
  key: 'dynamic_displacement',
  name: 'FIELD_DISPLACEMENT',
  precision: Feature.Property.TopInclination.Displacement.precision,
  unit: Feature.Property.TopInclination.Displacement.unit
};
const displacementEw: WaveformProperty = {
  key: 'dynamic_displacement_ew',
  name: 'FIELD_DISPLACEMENT_EW2',
  precision: Feature.Property.TopInclination.Displacement.precision
};
const displacementNs: WaveformProperty = {
  key: 'dynamic_displacement_ns',
  name: 'FIELD_DISPLACEMENT_NS2',
  precision: Feature.Property.TopInclination.Displacement.precision
};
const inclination: WaveformProperty = {
  key: 'dynamic_inclination',
  name: Feature.Property.TopInclination.Inclination.name,
  precision: Feature.Property.TopInclination.Inclination.precision,
  unit: Feature.Property.TopInclination.Inclination.unit
};
const inclinationEw: WaveformProperty = {
  key: 'dynamic_inclination_ew',
  name: 'FIELD_INCLINATION_EW2',
  precision: Feature.Property.TopInclination.Inclination.precision
};
const inclinationNs: WaveformProperty = {
  key: 'dynamic_inclination_ns',
  name: 'FIELD_INCLINATION_NS2',
  precision: Feature.Property.TopInclination.Inclination.precision
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
          precision: Feature.Property.TopInclination.Displacement.precision
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
          precision: Feature.Property.Inclination.precision
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
          precision: Feature.Property.TopInclination.Displacement.precision
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
          precision: Feature.Property.Inclination.precision
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
      precision: Feature.Property.SVT_WIRELESS.AccelerationRMS.precision,
      unit: Feature.Property.SVT_WIRELESS.AccelerationRMS.unit
    },
    {
      key: 'accelerationFrequencyDomain',
      name: 'FIELD_ACCELERATION_FREQUENCY_DOMAIN',
      precision: Feature.Property.SVT_WIRELESS.AccelerationRMS.precision,
      unit: Feature.Property.SVT_WIRELESS.AccelerationRMS.unit
    },
    {
      key: 'velocityTimeDomain',
      name: 'FIELD_VELOCITY_TIME_DOMAIN',
      precision: Feature.Property.SVT_WIRELESS.VelocityRMS.precision,
      unit: Feature.Property.SVT_WIRELESS.VelocityRMS.unit
    },
    {
      key: 'velocityFrequencyDomain',
      name: 'FIELD_VELOCITY_FREQUENCY_DOMAIN',
      precision: Feature.Property.SVT_WIRELESS.VelocityRMS.precision,
      unit: Feature.Property.SVT_WIRELESS.VelocityRMS.unit
    },
    {
      key: 'displacementTimeDomain',
      name: 'FIELD_DISPLACEMENT_TIME_DOMAIN',
      precision: Feature.Property.SVT_WIRELESS.DisplacementRMS.precision,
      unit: Feature.Property.SVT_WIRELESS.DisplacementRMS.unit
    },
    {
      key: 'displacementFrequencyDomain',
      name: 'FIELD_DISPLACEMENT_FREQUENCY_DOMAIN',
      precision: Feature.Property.SVT_WIRELESS.DisplacementRMS.precision,
      unit: Feature.Property.SVT_WIRELESS.DisplacementRMS.unit
    }
  ]
};

export const PROPERTIES_WITH_ENVELOPE: VibrationPropertyKey[] = [
  'accelerationTimeDomain',
  'velocityTimeDomain',
  'displacementTimeDomain'
];

export enum WaveformMonitoringPointKey {
  Corrosion = MonitoringPoint.Type.Enum.Corrosion,
  HighTemperatureCorrosion = MonitoringPoint.Type.Enum.HighTemperatureCorrosion,
  UltraHighTemperatureCorrosion = MonitoringPoint.Type.Enum.UltraHighTemperatureCorrosion,
  BoltPreload = MonitoringPoint.Type.Enum.BoltPreload,
  AnchorPreload = MonitoringPoint.Type.Enum.AnchorPreload,
  Vibration = MonitoringPoint.Type.Enum.Vibration,
  VibrationRotationSingleAxis = MonitoringPoint.Type.Enum.VibrationRotationSingleAxis,
  VibrationRotation = MonitoringPoint.Type.Enum.VibrationRotation,
  TopInclination = MonitoringPoint.Type.Enum.TopInclination,
  BaseInclination = MonitoringPoint.Type.Enum.BaseInclination
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
