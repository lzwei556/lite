import { MonitoringPointType } from 'common';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  SiteName: 'app.hydro',
  MonitoringPointTypeOptions: MonitoringPointType.Categories.getOptions(['loosening', 'preload']),
  DeviceTypes: MonitoringPointType.Categories.getDeviceTypes(['loosening', 'preload'])
};
