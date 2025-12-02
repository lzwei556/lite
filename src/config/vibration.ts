import { MonitoringPointType } from 'common';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  SiteName: 'IOT_CLOUD_MONITORING_SYSTEM',
  MonitoringPointTypeOptions: MonitoringPointType.Categories.getOptions(['vibration']),
  DeviceTypes: MonitoringPointType.Categories.getDeviceTypes(['vibration'])
};
