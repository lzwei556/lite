import React from 'react';
import AntIcon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import { Asset, AssetRow } from '../../asset-common';
import { ReactComponent as SVG } from './general.svg';

export const Icon = (props: Partial<CustomIconComponentProps> & { asset: AssetRow }) => {
  const { asset, ...rest } = props;
  const commonProps = { ...rest, fill: Asset.Status.getColorByValue(asset.alertLevel) };
  return <AntIcon component={() => <SVG {...commonProps} />} />;
};
