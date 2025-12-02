import { MonitoringPointType } from 'common';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  SiteName: 'WIND_TURBINE_BOLT_MONITORING_SYSTEM',
  MonitoringPointTypeOptions: MonitoringPointType.Categories.getOptions([
    'loosening',
    'preload',
    'inclination'
  ]),
  DeviceTypes: MonitoringPointType.Categories.getDeviceTypes([
    'loosening',
    'preload',
    'inclination'
  ])
};
