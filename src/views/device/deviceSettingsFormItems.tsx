import React from 'react';
import { DeviceSetting } from '../../types/device_setting';
import { DeviceType } from '../../types/device_type';
import { SVTSettings } from './svtSettings';
import { DeviceGroupedSettingContent } from './DeviceGroupedSettingContent';

export const DeviceSettingsFormItems = ({
  deviceType,
  settings,
  filterSingleGroup = false
}: {
  deviceType: number;
  settings: DeviceSetting[];
  filterSingleGroup?: boolean;
}) => {
  if (DeviceType.isVibration(deviceType)) {
    return <SVTSettings settings={settings} type={deviceType} />;
  } else {
    return (
      <DeviceGroupedSettingContent settings={settings} filterSingleGroup={filterSingleGroup} />
    );
  }
};
