import { Device } from 'types/device';
import { MonitoringPointAttributes } from './monitoring-point-attributes';

export type MonitoringPoint = Omit<MonitoringPointDTO, 'bindingDevices'> & { device?: Device };

export type Property = {
  key: string;
  name: string;
  precision: number;
  sort: number;
  unit: string;
  fields: { key: string; name: string; dataIndex: number }[];
  data: { [propName: string]: number };
  isShow: boolean;
};

export type MonitoringPointDTO = {
  alertLevel: number;
  assetId: number;
  attributes: MonitoringPointAttributes;
  bindingDevices: Device[];
  data: { timestamp: number; values: { [key: string]: number } };
  id: number;
  name: string;
  properties: Property[];
  type: number;
};

export type MonitoringPointPostDTO = {
  asset_id: number;
  attributes: MonitoringPointAttributes;
  channel?: number;
  device_id?: number;
  deviceName?: string;
  name: string;
  type: number;
  typeLabel?: string;
};

export const tranform = (dto: MonitoringPointDTO): MonitoringPoint => {
  return { ...dto, device: dto.bindingDevices?.[0] };
};

export const tranform2PostDTO = (point: MonitoringPoint): MonitoringPointPostDTO => {
  return { ...point, asset_id: point.assetId, device_id: point.device?.id };
};
