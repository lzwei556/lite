import * as React from 'react';
import intl from 'react-intl-universal';
import { Tag } from 'antd';
import { ColorHealth, ColorOffline } from '../../constants/color';
import { Device } from '../../types/device';
import { useUpgrageStatus } from './detail/useUpgradeStatus';
import DeviceUpgradeSpin from './spin/deviceUpgradeSpin';

export const SingleDeviceStatus = ({ device }: { device: Device }) => {
  const { state } = device;
  const isOnline = state && state.isOnline;
  const upgradeStatus = useUpgrageStatus(device);
  if (upgradeStatus) {
    return <DeviceUpgradeSpin status={upgradeStatus} />;
  } else {
    return (
      <Tag
        color={isOnline ? ColorHealth : ColorOffline}
        style={isOnline ? undefined : { color: '#000' }}
      >
        {intl.get(isOnline ? 'ONLINE' : 'OFFLINE')}
      </Tag>
    );
  }
};
