import { ObjectToCamel } from 'ts-case-convert';

type DeviceFeature = {
  id: number;
  mac: string;
  name: string;
  type: number;
  isOnline: boolean;
  batteryVoltage: number;
  features: { signal_quality: number; signal_strength: number };
  evaluationLevel: number;
  evaluationReasons?: number[];
};

type AlarmRuleGroup = {
  id: number;
  name: string;
  description: string;
  category: number;
  type: number;
  rules: {
    id: number;
    name: string;
    description: string;
    index?: any;
    duration: number;
    operation: string;
    threshold: number;
    level: number;
    source_type?: number;
    category: number;
    metric: any;
  }[];
};

type MonitoringPointFeature = {
  id: number;
  name: string;
  assetName: string;
  features: {
    corrosion_rate: number;
    residual_life: number;
    thickness_average: number;
    thickness_delta: number;
    thickness_last: number;
    thickness_new: number;
  };
  attributes: {
    corrosion_rate_long_term: number;
    corrosion_rate_short_term: number;
    critical_thickness_enabled: boolean;
    index: number;
    initial_thickness_enabled: boolean;
  };
  alarmRuleGroups: AlarmRuleGroup[];
  evaluationLevel: number;
  evaluationReasons?: number[];
};

export type ReportDTO = {
  id: number;
  start: number;
  end: number;
  filename: string;
  reportName: string;
  reportDate: number;
  alarmRecords?: any;
  alarmRecordsStat?: {
    minorAlarmNum: number;
    majorAlarmNum: number;
    criticalAlarmNum: number;
    handledNum: number;
    unhandledNum: number;
  };
  assetsStat: {
    normalAlarmNum: number;
    minorAlarmNum: number;
    majorAlarmNum: number;
    criticalAlarmNum: number;
  };
  monitoringPointsStat: {
    normalAlarmNum: number;
    minorAlarmNum: number;
    majorAlarmNum: number;
    criticalAlarmNum: number;
  };
  monitoringPointFeatures: MonitoringPointFeature[];
  devicesStat: { onlineNum: number; offlineNum: number };
  deviceFeatures: DeviceFeature[];
};

export type ReportDevice = DeviceFeature &
  ObjectToCamel<DeviceFeature['features']> & { typeName: string };

export type ReportMonitoringPoint = MonitoringPointFeature &
  ObjectToCamel<MonitoringPointFeature['features']> &
  ObjectToCamel<MonitoringPointFeature['attributes']> & {
    indexName: string;
    conditions: string[];
  };

export type Report = ReportDTO & {
  devices: ReportDevice[];
  monitoringPoints: ReportMonitoringPoint[];
};
