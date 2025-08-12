import { MotorAttrs } from '../asset-variant';
import { MonitoringPointRow } from '../monitoring-point';
import { AssetChildrenStatistics } from './utils/statistics';

export type AssetModel = {
  id: number;
  name: string;
  type: number;
  parent_id: number;
  attributes?: {
    index: number;
    type: number;
    normal?: { enabled: boolean; value: number | undefined };
    initial?: { enabled: boolean; value: number | undefined };
    info?: { enabled: boolean; value: number | undefined };
    warn?: { enabled: boolean; value: number | undefined };
    danger?: { enabled: boolean; value: number | undefined };
    sub_type: number;
    monitoring_points_num: number;
    sample_period: number;
    sample_time_offset: number;
    initial_preload: number;
    initial_pressure: number;
  };
};

export type AssetRow = {
  id: number;
  name: string;
  type: number;
  parentId: number;
  projectId: number;
  monitoringPoints?: MonitoringPointRow[];
  children?: AssetRow[];
  label: React.ReactNode;
  value: string | number;
  statistics: AssetChildrenStatistics;
  image?: string;
  alertLevel: number;
  attributes?: {
    index: number;
    type: number;
    normal?: { enabled: boolean; value: number | undefined };
    initial?: { enabled: boolean; value: number | undefined };
    info?: { enabled: boolean; value: number | undefined };
    warn?: { enabled: boolean; value: number | undefined };
    danger?: { enabled: boolean; value: number | undefined };
    sub_type: number;
    monitoring_points_num: number;
    sample_period: number;
    sample_time_offset: number;
    initial_preload: number;
    initial_pressure: number;
    canvasSnapshot?: { id: number; x: number; y: number }[];
  } & Partial<MotorAttrs>;
};

export type AssetCategory = { type: number; label: string; labelPlural?: string };
