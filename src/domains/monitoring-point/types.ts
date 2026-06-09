import { Device } from 'types/device';
import { Entity as Settings } from './settings';

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

export type DTO = {
  alertLevel?: number;
  assetId: number;
  attributes?: Settings;
  bindingDevices: Device[];
  componentId?: number;
  data: { timestamp: number; values: { [key: string]: number } };
  id: number;
  name: string;
  properties: Property[];
  type: number;
};

export type PostDTO = {
  asset_id: number;
  attributes?: Settings;
  channel?: number;
  component_id?: number;
  device_id?: number;
  deviceName?: string;
  name: string;
  type: number;
  typeLabel?: string;
};

export type Entity = Omit<DTO, 'bindingDevices'> & { parentId?: number; sensor?: Device };

export const transform = (dto: DTO): Entity => {
  return { ...dto, sensor: dto?.bindingDevices?.[0] };
};

export const transform2PostDTO = (point: Entity): PostDTO => {
  return { ...point, asset_id: point.assetId, device_id: point.sensor?.id };
};
