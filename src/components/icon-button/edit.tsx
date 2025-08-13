import React from 'react';
import { EditOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { IconButton, IconButtonProps } from './button';

export const EditIconButton = ({
  icon = <EditOutlined />,
  size = 'small',
  variant = 'outlined',
  tooltipProps = { title: intl.get('EDIT'), placement: 'left' },
  ...rest
}: IconButtonProps) => {
  return (
    <IconButton icon={icon} size={size} tooltipProps={tooltipProps} variant={variant} {...rest} />
  );
};
