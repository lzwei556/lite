import { DeviceType } from '../types/device_type';
import { MonitoringPointTypeText, MonitoringPointTypeValue } from './common';

export const SITE_NAME = 'HYDRO_TURBINE_BOLT_MONITORING_SYSTEM';

export const SENSORS = [
  DeviceType.SA,
  DeviceType.SA_S,
  DeviceType.SAS,
  DeviceType.DS4,
  DeviceType.DS8
];
export const MONITORING_POINTS = [
  {
    id: MonitoringPointTypeValue.BoltLoosening,
    label: MonitoringPointTypeText.BoltLoosening
  },
  { id: MonitoringPointTypeValue.BoltPreload, label: MonitoringPointTypeText.BoltPreload },
  { id: MonitoringPointTypeValue.AnchorPreload, label: MonitoringPointTypeText.AnchorPreload }
];
