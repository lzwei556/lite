import React from 'react';
import { FormInstance, SelectProps } from 'antd';
import { DeviceType } from '../../../types/device_type';
import { Device } from '../../../types/device';
import { ProvisioningMode } from '../../../features/wsn';
import { DEFAULT_WSN_SETTING } from '../../../types/wsn_setting';
import { App, useAppType } from '../../../config';
import { GetDefaultDeviceSettingsRequest, GetDeviceSettingRequest } from '../../../apis/device';
import { GetNetworksRequest } from '../../../apis/network';
import { DeviceSetting } from '../settings-common';

export function useContextProps(props: { device?: Device; form?: FormInstance }) {
  const {
    deviceType,
    settings,
    selectProps: deviceTypeSelectProps
  } = useDeviceTypeSelectProps(props);
  const { networkId, selectProps: parentSelectProps } = useParentSelectProps(props);
  return {
    deviceType,
    settings,
    deviceTypeSelectProps,
    networkId,
    parentSelectProps
  };
}

const useDeviceTypeSelectProps = ({ form, device }: { form?: FormInstance; device?: Device }) => {
  const [deviceType, setDeviceType] = React.useState<DeviceType | undefined>(device?.typeId);
  const [settings, setSettings] = React.useState<DeviceSetting[]>([]);

  React.useEffect(() => {
    if (deviceType) {
      if (device?.id) {
        GetDeviceSettingRequest(device.id).then(setSettings);
      } else {
        GetDefaultDeviceSettingsRequest(deviceType).then(setSettings);
      }
    }
    return () => setSettings([]);
  }, [deviceType, device?.id]);

  return {
    deviceType,
    settings,
    selectProps: {
      disabled: !!device,
      options: useGroupedDeviceTypeOptions(),
      onChange: (deviceType: number) => {
        setDeviceType(deviceType);
        setSettingsInitialValues(settings, form);
        form?.setFieldsValue?.({
          mode: ProvisioningMode.TimeDivision,
          wsn: DEFAULT_WSN_SETTING,
          protocol: 3
        });
      }
    }
  };
};

const useGroupedDeviceTypeOptions = () => {
  const appType = useAppType();
  const deviceTypes: SelectProps['options'] = [];
  if (appType !== 'corrosionWirelessHART') {
    deviceTypes.push({
      label: 'GATEWAY',
      options: DeviceType.getGateways().map((t) => ({
        label: DeviceType.toString(t),
        value: t
      }))
    });
    deviceTypes.push({
      label: 'RELAY',
      options: DeviceType.getRouters().map((t) => ({
        label: DeviceType.toString(t),
        value: t
      }))
    });
  }
  deviceTypes.push({
    label: 'SENSOR',
    options: App.getDeviceTypes(appType).map((t) => ({
      label: DeviceType.toString(t),
      value: t
    }))
  });
  return deviceTypes;
};

const setSettingsInitialValues = (settings: DeviceSetting[], form?: FormInstance) => {
  if (settings && settings.length > 0) {
    settings.forEach((s) => {
      form?.setFieldValue?.([s.category, s.key], s.key === 'sensor_flags' ? [s.value] : s.value);
    });
  }
};

const useParentSelectProps = ({ form, device }: { form?: FormInstance; device?: Device }) => {
  const [networkId, setNetworkId] = React.useState<number | undefined>();
  return {
    networkId,
    selectProps: {
      device,
      dispalyField: device ? 'macAddress' : ('id' as keyof Pick<Device, 'id' | 'macAddress'>),
      onChange: (_: string, option: any) => {
        GetNetworksRequest().then((networks) => {
          const network = networks.find((network) => network.gateway.id === option.gatewayId);
          if (network) {
            setNetworkId(network.id);
            form?.setFieldValue('network', network.id);
          }
        });
      }
    }
  };
};
