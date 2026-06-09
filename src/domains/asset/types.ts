import { Types } from 'domains/monitoring-point';
import { Settings } from './settings/capability';
import * as MonitoringPoint from '../monitoring-point';

export type DTO = {
  alertLevel: number;
  attributes?: Settings;
  children?: DTO[];
  diagnosisIsEnabled?: boolean;
  diagnosisPeriod?: number;
  id: number;
  image?: string;
  monitoringPoints?: Types.DTO[];
  name: string;
  parentId: number;
  projectId: number;
  statistics: Statistics;
  type: number;
};

type Statistics = {
  alarmNum?: [number, number, number];
  assetId: number;
  deviceNum: number;
  monitoringPointNum: number;
  offlineDeviceNum: number;
};

export type Entity = Omit<DTO, 'children' | 'monitoringPoints'> & {
  children?: Entity[];
  monitoringPoints?: MonitoringPoint.Types.Entity[];
};
