import { DeviceType } from '../types/device_type';
import { MonitoringPointTypeText, MonitoringPointTypeValue } from './common';

export const SITE_NAME = 'CORROSION_MONITORING_SYSTEM';

export const SENSORS = DeviceType.getDCSensors();
export const MONITORING_POINTS = [
  { id: MonitoringPointTypeValue.Corrosion, label: MonitoringPointTypeText.Corrosion },
  {
    id: MonitoringPointTypeValue.HighTemperatureCorrosion,
    label: MonitoringPointTypeText.HighTemperatureCorrosion
  },
  {
    id: MonitoringPointTypeValue.UltraHighTemperatureCorrosion,
    label: MonitoringPointTypeText.UltraHighTemperatureCorrosion
  }
];
