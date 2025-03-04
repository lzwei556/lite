import { MonitoringPointTypeValue } from '../../../config';
import { PROPERTY_CATEGORIES } from '../../../constants/properties';

export const MONITORING_POINT_DISPLAY_PROPERTIES = {
  [MonitoringPointTypeValue.BoltLoosening]: PROPERTY_CATEGORIES.SA,
  [MonitoringPointTypeValue.Corrosion]: PROPERTY_CATEGORIES.DC_NORMAL,
  [MonitoringPointTypeValue.HighTemperatureCorrosion]: PROPERTY_CATEGORIES.DC_NORMAL,
  [MonitoringPointTypeValue.LowTemperatureCorrosion]: PROPERTY_CATEGORIES.DC_NORMAL,
  [MonitoringPointTypeValue.BoltPreload]: PROPERTY_CATEGORIES.SAS,
  [MonitoringPointTypeValue.AnchorPreload]: PROPERTY_CATEGORIES.SAS,
  [MonitoringPointTypeValue.FlangeBoltPreload]: PROPERTY_CATEGORIES.SAS,
  [MonitoringPointTypeValue.FlangeAnchorPreload]: PROPERTY_CATEGORIES.SAS,
  [MonitoringPointTypeValue.Vibration]: PROPERTY_CATEGORIES.SVT210510P,
  [MonitoringPointTypeValue.VibrationRotationSingleAxis]: PROPERTY_CATEGORIES.SVT220S1S3,
  [MonitoringPointTypeValue.VibrationRotation]: PROPERTY_CATEGORIES.SVT220S1S3,
  [MonitoringPointTypeValue.TopInclination]: PROPERTY_CATEGORIES.TopInclination,
  [MonitoringPointTypeValue.BaseInclination]: PROPERTY_CATEGORIES.BaseInclination,
  [MonitoringPointTypeValue.Pressure]: PROPERTY_CATEGORIES.SPT,
  [MonitoringPointTypeValue.Temperature]: PROPERTY_CATEGORIES.ST
};

export const MONITORING_POINT = 'MONITORING_POINT';
export const MONITORING_POINT_LIST = `MONITORING_POINT_LIST`;
export const INVALID_MONITORING_POINT = `ABNORMAL_MONITORING_POINT`;
