import React from 'react';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import { Asset, AssetRow } from '../asset-common';
import { Icon as MotorIcon } from './motor/icon';
import { Icon as PipeIcon } from './pipe/icon';
import { device, motor, pipe, tank } from './constants';
import { Icon as DeviceIcon } from './device/icon';

export const Icon = (props: Partial<CustomIconComponentProps> & { asset: AssetRow }) => {
  const { asset, ...rest } = props;
  const commonProps = { ...rest, fill: Asset.Status.getColorByValue(asset.alertLevel) };
  if (asset.type === motor.type) {
    return <MotorIcon {...commonProps} />;
  } else if (asset.type === pipe.type || asset.type === tank.type) {
    return <PipeIcon {...commonProps} />;
  } else if (asset.type === device.type) {
    return <DeviceIcon {...commonProps} />;
  } else {
    return null;
  }
};
