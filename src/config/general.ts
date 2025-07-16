import { DeviceType } from '../types/device_type';
import { MonitoringPointTypeText, MonitoringPointTypeValue } from './common';

export const SITE_NAME = 'IOT_CLOUD_MONITORING_SYSTEM';

export const SENSORS = DeviceType.sensors();
export const MONITORING_POINTS = [
  {
    id: MonitoringPointTypeValue.BoltLoosening,
    label: MonitoringPointTypeText.BoltLoosening
  },
  { id: MonitoringPointTypeValue.Corrosion, label: MonitoringPointTypeText.Corrosion },
  {
    id: MonitoringPointTypeValue.HighTemperatureCorrosion,
    label: MonitoringPointTypeText.HighTemperatureCorrosion
  },
  {
    id: MonitoringPointTypeValue.UltraHighTemperatureCorrosion,
    label: MonitoringPointTypeText.UltraHighTemperatureCorrosion
  },
  { id: MonitoringPointTypeValue.BoltPreload, label: MonitoringPointTypeText.BoltPreload },
  {
    id: MonitoringPointTypeValue.AnchorPreload,
    label: MonitoringPointTypeText.AnchorPreload
  },
  { id: MonitoringPointTypeValue.Vibration, label: MonitoringPointTypeText.Vibration },
  {
    id: MonitoringPointTypeValue.VibrationRotationSingleAxis,
    label: MonitoringPointTypeText.VibrationRotationSingleAxis
  },
  {
    id: MonitoringPointTypeValue.VibrationRotation,
    label: MonitoringPointTypeText.VibrationRotation
  },
  {
    id: MonitoringPointTypeValue.TopInclination,
    label: MonitoringPointTypeText.TopInclination
  },
  {
    id: MonitoringPointTypeValue.BaseInclination,
    label: MonitoringPointTypeText.BaseInclination
  },
  {
    id: MonitoringPointTypeValue.Pressure,
    label: MonitoringPointTypeText.Pressure
  },
  { id: MonitoringPointTypeValue.Temperature, label: MonitoringPointTypeText.Temperature }
];
