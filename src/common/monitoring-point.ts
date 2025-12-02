import { MonitoringPointAttributes } from './monitoring-point-attributes';

export type MonitoringPointPostDTO = {
  name: string;
  type: number;
  device_id: number;
  asset_id: number;
  attributes: MonitoringPointAttributes;
};
