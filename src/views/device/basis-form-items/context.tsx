import React from 'react';
import { SelectProps, FormInstance } from 'antd';
import { DeviceType } from '../../../types/device_type';
import { Device } from '../../../types/device';
import { DeviceSetting } from '../settings-common';
import { useContextProps } from './hooks';

const Context = React.createContext<{
  deviceType: DeviceType | undefined;
  settings: DeviceSetting[];
  deviceTypeSelectProps: SelectProps;
  networkId: number | undefined;
  parentSelectProps: SelectProps;
}>({
  deviceType: undefined,
  settings: [],
  deviceTypeSelectProps: {},
  networkId: undefined,
  parentSelectProps: {}
});

export const ContextProvier = ({
  children,
  ...rest
}: {
  children: React.ReactNode;
  device?: Device;
  form?: FormInstance;
}) => {
  return <Context.Provider value={useContextProps(rest)}>{children}</Context.Provider>;
};

export const useContext = () => React.useContext(Context);
