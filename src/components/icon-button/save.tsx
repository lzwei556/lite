import React from 'react';
import { SaveOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { IconButton, IconButtonProps } from './button';

export const SaveIconButton = ({
  color = 'primary',
  icon = <SaveOutlined />,
  variant = 'outlined',
  tooltipProps = { title: intl.get('SAVE') },
  ...rest
}: IconButtonProps) => {
  return (
    <IconButton color={color} icon={icon} tooltipProps={tooltipProps} variant={variant} {...rest} />
  );
};
