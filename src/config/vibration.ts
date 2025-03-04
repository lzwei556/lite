import { DeviceType } from '../types/device_type';
import { MonitoringPointTypeText, MonitoringPointTypeValue } from './common';

export const SITE_NAME = 'IOT_CLOUD_MONITORING_SYSTEM';

export const SENSORS = DeviceType.vibrationSensors();
export const MONITORING_POINTS = [
  { id: MonitoringPointTypeValue.Vibration, label: MonitoringPointTypeText.Vibration },
  {
    id: MonitoringPointTypeValue.VibrationRotationSingleAxis,
    label: MonitoringPointTypeText.VibrationRotationSingleAxis
  },
  {
    id: MonitoringPointTypeValue.VibrationRotation,
    label: MonitoringPointTypeText.VibrationRotation
  }
];
