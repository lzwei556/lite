import { MonitoringPointType } from 'common';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  SiteName: 'HYDRO_TURBINE_BOLT_MONITORING_SYSTEM',
  MonitoringPointTypeOptions: MonitoringPointType.Categories.getOptions(['loosening', 'preload']),
  DeviceTypes: MonitoringPointType.Categories.getDeviceTypes(['loosening', 'preload'])
};
