import { DeviceType } from '../types/device_type';
import { MonitoringPointTypeText, MonitoringPointTypeValue } from './common';

export const SITE_NAME = 'CORROSION_MONITORING_SYSTEM';

export const SENSORS = [
  DeviceType.DC110,
  DeviceType.DC110C,
  DeviceType.DC210,
  DeviceType.DC210C,
  DeviceType.DC110H,
  DeviceType.DC110HC,
  DeviceType.DC110L
];
export const MONITORING_POINTS = [
  { id: MonitoringPointTypeValue.Corrosion, label: MonitoringPointTypeText.Corrosion },
  {
    id: MonitoringPointTypeValue.HighTemperatureCorrosion,
    label: MonitoringPointTypeText.HighTemperatureCorrosion
  },
  {
    id: MonitoringPointTypeValue.LowTemperatureCorrosion,
    label: MonitoringPointTypeText.LowTemperatureCorrosion
  }
];
