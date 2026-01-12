import React from 'react';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import { Asset, AssetRow } from 'asset-common';
import { AssetCategory } from 'common/asset-category';
import AntIcon from '@ant-design/icons';
import { ReactComponent as MotorSvg } from './motor.svg';
import { ReactComponent as CorrosionSvg } from './corrosion.svg';
import { ReactComponent as DeviceSvg } from './device.svg';
import { ReactComponent as FlangeSvg } from './flange.svg';
import { ReactComponent as TowerSvg } from './tower.svg';

export const Icon = (props: Partial<CustomIconComponentProps> & { asset: AssetRow }) => {
  const { asset, ...rest } = props;
  const { alertLevel, type } = asset;
  const commonProps = { ...rest, fill: Asset.Status.getColorByValue(alertLevel) };
  if (AssetCategory.Categories.getKeys(['vibration']).includes(type)) {
    return <AntIcon component={() => <MotorSvg {...commonProps} />} />;
  } else if (AssetCategory.Categories.getKeys(['corrosion']).includes(type)) {
    return <AntIcon component={() => <CorrosionSvg {...commonProps} />} />;
  } else if (AssetCategory.Categories.getKeys(['device']).includes(type)) {
    return <AntIcon component={() => <DeviceSvg {...commonProps} />} />;
  } else if (AssetCategory.Value.Flange === type) {
    return <AntIcon component={() => <FlangeSvg {...commonProps} />} />;
  } else if (AssetCategory.Value.Tower === type) {
    return <AntIcon component={() => <TowerSvg {...commonProps} />} />;
  } else {
    return <AntIcon component={() => <MotorSvg {...commonProps} />} />;
  }
};
