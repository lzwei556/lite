import { MonitoringPointType } from 'common';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  SiteName: 'app.corrosion',
  MonitoringPointTypeOptions: MonitoringPointType.Categories.getOptions(['corrosion']),
  DeviceTypes: MonitoringPointType.Categories.getDeviceTypes(['corrosion'])
};
