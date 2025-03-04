import React from 'react';
import { Descriptions as AntDescriptions, DescriptionsProps as AntDescriptionsProps } from 'antd';

export type DescriptionsProps = AntDescriptionsProps;

export const Descriptions = ({
  bordered = false,
  column = 1,
  colon = false,
  contentStyle,
  size = 'small',
  ...rest
}: DescriptionsProps) => {
  return (
    <AntDescriptions
      bordered={bordered}
      colon={colon}
      column={column}
      contentStyle={{ justifyContent: 'flex-end', ...contentStyle }}
      size={size}
      {...rest}
    />
  );
};
