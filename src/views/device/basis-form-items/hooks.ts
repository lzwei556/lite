import React from 'react';
import intl from 'react-intl-universal';
import { SelectProps } from 'antd';
import { useFormItemBindingsProps } from '../../../hooks';
import { Normalizes } from '../../../constants/validator';
import { DeviceType } from '../../../types/device_type';
import { Device } from '../../../types/device';
import { App, useAppType } from '../../../config';
import { pickOptionsFromNumericEnum } from '../../../utils';
import { GetNetworksRequest } from '../../../apis/network';
import * as Basis from '../basis-form-items';
import { FormCommonProps, FormItemsProps } from '../settings-common';

export type CommonProps = Pick<FormCommonProps, 'form'>;

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

  return {
    deviceName,
    mac,
    deviceTypeProps: { ...deviceType, selectProps: useDeviceTypeSelectProps(form) }
  };
};

const useDeviceTypeSelectProps = (form: CommonProps['form']) => {
  const { setDeviceType, settings, device } = Basis.useContext();
  return {
    disabled: !!device,
    options: useGroupedDeviceTypeOptions(),
    onChange: (deviceType: number) => {
      setDeviceType(deviceType);
      setSettingsInitialValues(settings, form);
    }
  };
};

const useGroupedDeviceTypeOptions = () => {
  const appType = useAppType();
  const deviceTypes: SelectProps['options'] = [];
  if (appType !== 'corrosionWirelessHART') {
    deviceTypes.push({
      label: intl.get('GATEWAY'),
      options: DeviceType.getGateways().map((t) => ({
        label: intl.get(DeviceType.toString(t)),
        value: t
      }))
    });
    deviceTypes.push({
      label: intl.get('RELAY'),
      options: DeviceType.getRouters().map((t) => ({
        label: intl.get(DeviceType.toString(t)),
        value: t
      }))
    });
  }
  deviceTypes.push({
    label: intl.get('SENSOR'),
    options: App.getDeviceTypes(appType).map((t) => ({
      label: intl.get(DeviceType.toString(t)),
      value: t
    }))
  });
  return deviceTypes;
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

export const useProtocolProps = () => {
  return {
    ...useFormItemBindingsProps({
      label: 'wan.interface.protocol',
      name: 'protocol'
    }),
    selectProps: {
      options: pickOptionsFromNumericEnum(WanProtocol, 'wan.interface.protocol').map((opts) => ({
        ...opts,
        label: intl.get(opts.label)
      }))
    }
  };
};

export const useParentProps = (form: CommonProps['form']) => {
  const parent = useFormItemBindingsProps({ label: 'PARENT', name: 'parent' });
  const [networkId, setNetworkId] = React.useState<number | undefined>();
  return {
    networkId,
    parent,
    selectProps: useParentSelectProps(form, setNetworkId),
    network: useFormItemBindingsProps({ name: 'network', hidden: true })
  };
};

const useParentSelectProps = (form: CommonProps['form'], setNetworkId?: (id: number) => void) => {
  const { device } = Basis.useContext();
  return {
    device,
    dispalyField: device ? 'macAddress' : ('id' as keyof Pick<Device, 'id' | 'macAddress'>),
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
