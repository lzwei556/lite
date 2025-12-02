import { MonitoringPointType } from 'common';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  SiteName: 'CORROSION_MONITORING_SYSTEM',
  MonitoringPointTypeOptions: MonitoringPointType.Categories.getOptions(['corrosion']),
  DeviceTypes: MonitoringPointType.Categories.getDeviceTypes(['corrosion'])
};
