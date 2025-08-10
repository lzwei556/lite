import * as React from 'react';
import intl from 'react-intl-universal';
import { Tag } from 'antd';
import { ColorHealth, ColorOffline } from '../constants/color';
import { Device } from '../types/device';
import { useGlobalStyles } from '../styles';
import { useUpgrageStatus } from './useUpgradeStatus';
import { DeviceUpgradeSpin } from './deviceUpgradeSpin';

export const SingleDeviceStatus = ({ device }: { device: Device }) => {
  const { state } = device;
  const isOnline = state && state.isOnline;
  const upgradeStatus = useUpgrageStatus(device);
  const { colorTextStyle } = useGlobalStyles();
  if (upgradeStatus) {
    return <DeviceUpgradeSpin status={upgradeStatus} />;
  } else {
    return (
      <Tag
        color={isOnline ? ColorHealth : ColorOffline}
        style={isOnline ? undefined : colorTextStyle}
      >
        {intl.get(isOnline ? 'ONLINE' : 'OFFLINE')}
      </Tag>
    );
  }
};
