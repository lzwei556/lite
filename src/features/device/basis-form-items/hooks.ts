import React from 'react';
import intl from 'react-intl-universal';
import { SelectProps } from 'antd';
import { useFormItemBindingsProps } from '../../../hooks';
import { Normalizes } from '../../../constants/validator';
import { DeviceType } from '../../../types/device_type';
import { Device } from '../../../types/device';
import { pickOptionsFromNumericEnum } from '../../../utils';
import { GetNetworksRequest } from '../../../apis/network';
import { GetDefaultDeviceSettingsRequest } from '../../../apis/device';
import { FormCommonProps, FormItemsProps } from '../settings-common';
import * as Basis from '.';
import { useAppConfig } from 'providers/app';

export type CommonProps = Pick<FormCommonProps, 'form'>;

export const useFilterParentDeviceTypes = (deviceType?: DeviceType) => {
  if (deviceType === DeviceType.OilFiller || deviceType === DeviceType.SVT210SU) {
    return [DeviceType.GatewayGS280];
  }
  return [];
};

export const useProps = (form: CommonProps['form']) => {
  const deviceName = useFormItemBindingsProps({
    label: 'DEVICE_NAME',
    name: 'name',
    rules: [{ required: true }, { min: 4, max: 20 }]
  });
  const mac = useFormItemBindingsProps({
    label: 'MAC_ADDRESS',
    name: 'mac_address',
    normalize: Normalizes.macAddress,
    rules: [
      { required: true },
      {
        pattern: /^([0-9a-fA-F]{2})(([0-9a-fA-F]{2}){5})$/,
        message: intl.get('MAC_ADDRESS_IS_INVALID')
      }
    ]
  });
  const deviceType = useFormItemBindingsProps({
    label: 'DEVICE_TYPE',
    name: 'type',
    rules: [{ required: true }]
  });
  const tag = useFormItemBindingsProps({ label: 'device.tag', name: 'tag' });
  const applicationId = useFormItemBindingsProps({
    label: 'application.id',
    name: 'application_id'
  });
  const port = useFormItemBindingsProps({ label: 'PORT', name: 'port' });
  return {
    deviceName,
    mac,
    deviceTypeProps: { ...deviceType, selectProps: useDeviceTypeSelectProps(form) },
    tag,
    applicationId,
    port: { ...port, selectProps: { options: [1, 2].map((n) => ({ label: `${n}`, value: n })) } }
  };
};

const useDeviceTypeSelectProps = (form: CommonProps['form']) => {
  const { setDeviceType, device, setSettings } = Basis.useContext();
  return {
    disabled: !!device,
    options: useGroupedDeviceTypeOptions(),
    onChange: (deviceType: number) => {
      GetDefaultDeviceSettingsRequest(deviceType).then((settings) => {
        setDeviceType(deviceType);
        setSettings(settings);
        setSettingsInitialValues(settings, form);
      });
    }
  };
};

const useGroupedDeviceTypeOptions = () => {
  const { type, deviceTypes } = useAppConfig();
  const deviceTypeOptions: SelectProps['options'] = [];
  if (type !== 'corrosionWirelessHART') {
    deviceTypeOptions.push({
      label: intl.get('GATEWAY'),
      options: DeviceType.getGateways().map((t) => ({
        label: intl.get(DeviceType.toString(t)),
        value: t
      }))
    });
    deviceTypeOptions.push({
      label: intl.get('RELAY'),
      options: DeviceType.getRouters().map((t) => ({
        label: intl.get(DeviceType.toString(t)),
        value: t
      }))
    });
  }
  deviceTypeOptions.push({
    label: intl.get('SENSOR'),
    options: deviceTypes.map((t) => ({
      label: intl.get(DeviceType.toString(t)),
      value: t
    }))
  });
  return deviceTypeOptions;
};

const setSettingsInitialValues = (
  settings: FormItemsProps['settings'],
  form: CommonProps['form']
) => {
  if (settings && settings.length > 0) {
    settings.forEach((s) => {
      form?.setFieldValue?.([s.category, s.key], s.key === 'sensor_flags' ? [s.value] : s.value);
    });
  }
};

export enum WanProtocol {
  Protobuf = 2,
  Tlv = 3
}

export const useProtocolProps = (disabledValue?: WanProtocol) => {
  return {
    ...useFormItemBindingsProps({
      label: 'wan.interface.protocol',
      name: 'protocol'
    }),
    selectProps: {
      options: pickOptionsFromNumericEnum(WanProtocol, 'wan.interface.protocol').map((opts) => ({
        ...opts,
        label: intl.get(opts.label),
        disabled: opts.value === disabledValue
      }))
    }
  };
};

export const useDisabledProtocal = (deviceType: DeviceType) => {
  if (DeviceType.GatewayGS280 === deviceType) {
    return WanProtocol.Protobuf;
  }
};

export const useParentProps = (form: CommonProps['form'], filterTypes?: DeviceType[]) => {
  const parent = useFormItemBindingsProps({
    label: 'PARENT',
    name: 'parent',
    rules: [{ required: true }]
  });
  const [networkId, setNetworkId] = React.useState<number | undefined>();
  return {
    networkId,
    parent,
    selectProps: useParentSelectProps(form, setNetworkId, filterTypes),
    network: useFormItemBindingsProps({ name: 'network', hidden: true })
  };
};

const useParentSelectProps = (
  form: CommonProps['form'],
  setNetworkId: (id: number) => void,
  filterTypes?: DeviceType[]
) => {
  const { device } = Basis.useContext();
  return {
    device,
    dispalyField: device ? 'macAddress' : ('id' as keyof Pick<Device, 'id' | 'macAddress'>),
    filterTypes,
    onChange: (_: string, option: any) => {
      GetNetworksRequest().then((networks) => {
        const network = networks.find((network) => network.gateway.id === option.gatewayId);
        if (network) {
          setNetworkId?.(network.id);
          form?.setFieldValue('network', network.id);
        }
      });
    }
  };
};
