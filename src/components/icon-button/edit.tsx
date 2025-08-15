import React from 'react';
import { EditOutlined } from '@ant-design/icons';
import { IconButton, IconButtonProps } from './button';

export const EditIconButton = ({
  icon = <EditOutlined />,
  size = 'small',
  variant = 'outlined',
  ...rest
}: IconButtonProps) => {
  return <IconButton icon={icon} size={size} variant={variant} {...rest} />;
};
