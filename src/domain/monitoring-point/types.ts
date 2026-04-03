import { Device } from 'types/device';
import {
  AxisWithVibrationDirectionLabel as AxisWithDirectionLabel,
  CorrosionMonitoringPointSettings,
  MonitoringPointSettings,
  VibrationDirectionSettings
} from './settings';

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

type MonitoringPointDTO = {
  alertLevel: number;
  assetId: number;
  attributes: MonitoringPointSettings;
  bindingDevices: Device[];
  data: { timestamp: number; values: { [key: string]: number } };
  id: number;
  name: string;
  properties: Property[];
  type: number;
};

type MonitoringPointPostDTO = {
  asset_id: number;
  attributes: MonitoringPointSettings;
  channel?: number;
  device_id?: number;
  deviceName?: string;
  name: string;
  type: number;
  typeLabel?: string;
};

export namespace TMonitoringPoint {
  export type Base = Omit<MonitoringPointDTO, 'bindingDevices'> & { device?: Device };
  export type DTO = MonitoringPointDTO;
  export type PostDTO = MonitoringPointPostDTO;
  export type Settings = MonitoringPointSettings;
  export namespace Settings {
    export type Corrosion = CorrosionMonitoringPointSettings;
    export type VibrationDirection = VibrationDirectionSettings;
    export type AxisWithVibrationDirectionLabel = AxisWithDirectionLabel;
  }
}

export const transform = (dto: MonitoringPointDTO): TMonitoringPoint.Base => {
  return { ...dto, device: dto?.bindingDevices?.[0] };
};

export const transform2PostDTO = (point: TMonitoringPoint.Base): MonitoringPointPostDTO => {
  return { ...point, asset_id: point.assetId, device_id: point.device?.id };
};


