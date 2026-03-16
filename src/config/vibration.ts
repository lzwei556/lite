import { MonitoringPointType } from 'common';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  SiteName: 'app.general',
  MonitoringPointTypeOptions: MonitoringPointType.Categories.getOptions(['vibration']),
  DeviceTypes: MonitoringPointType.Categories.getDeviceTypes(['vibration'])
};
