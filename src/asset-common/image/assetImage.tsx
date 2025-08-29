import React from 'react';
import { Image, ImageProps } from 'antd';
import { AssetRow } from '../types';
import DianJi from './dianji.png';

export const AssetImage = ({ asset, ...rest }: { asset: AssetRow } & ImageProps) => {
  // const x = asset.attributes.
  return <Image {...rest} src={DianJi} />;
};
