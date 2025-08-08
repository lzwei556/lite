import { ColProps, FormInstance } from 'antd';
import { DeviceType } from '../../../types/device_type';
import { Device } from '../../../types/device';
import { Network } from '../../../network';
import { CardProps } from '../../../components';
import * as SVT from './use-groupd-settings-svt';
import * as NonSVT from './use-groupd-settings';

export type DeviceSetting = {
  name: string;
  key: string;
  value: any;
  unit: string;
  category: string;
  type: string;
  options?: any;
  show: any;
  children?: DeviceSetting[];
  group?: string;
  validator: any;
  optionType: string;
  sort: number;
  onChange?: (paras: any) => void;
};

export type FormCommonProps = {
  device: Device;
  form?: FormInstance;
  network?: Network;
};

export type FormItemsProps = {
  deviceType?: DeviceType;
  settings: DeviceSetting[];
  formItemColProps?: ColProps;
  groupCardProps?: CardProps;
};

export type FormSubmitButtonProps = Pick<FormCommonProps, 'form'> & {
  handleSubmit: (values: any) => void;
  loading: boolean;
};

export function transformSettings(setting: any) {
  const newSetting = { ...setting };
  for (const key in newSetting) {
    if (Object.prototype.hasOwnProperty.call(newSetting, key)) {
      const value = newSetting[key];
      if (Array.isArray(value)) {
        newSetting[key] = convertArray2Single(value);
      }
    }
  }
  return newSetting;
}

function convertArray2Single(value: number[]) {
  return value.reduce((prev, crt) => prev | crt);
}

export function tranformDeviceDTO2Entity(device: Device) {
  return {
    name: device.name,
    mac_address: device.macAddress,
    type: device.typeId,
    protocol: filterInvalidProtocolValues(device.protocol),
    network: device.network && device.network.id,
    parent: device.parent
  };
}

const filterInvalidProtocolValues = (protocol: number) => {
  return protocol !== 2 && protocol !== 3 ? 2 : protocol;
};

export const isBLEGateway = (type: number) => DeviceType.isBLEGateway(type);

export const useGroupedSettings = (settings: DeviceSetting[], deviceType?: DeviceType) => {
  const svt = SVT.useGroupedSettings(settings, deviceType);
  const nonSVT = NonSVT.useGroupedSettings(settings);
  return DeviceType.isVibration(deviceType) ? svt : nonSVT;
};

export const useGroupCardProps = (props: CardProps) => {
  const { style = { marginBlock: 16 }, ...rest } = props;
  return { style, ...rest } as CardProps;
};

export const GROUPS = {
  preload: 'SETTING_GROUP_PRELOAD',
  general: 'SETTING_GROUP_GENERAL',
  network: 'SETTING_GROUP_NETWORK',
  thickness: 'SETTING_GROUP_THICKNESS',
  inclinometer: 'SETTING_GROUP_INCLINOMETER',
  basic: 'settings.group.basic',
  dat: 'settings.group.data.acquisition.time',
  dap: 'settings.group.data.acquisition.parameter'
};
