import React from 'react';
import { SaveOutlined } from '@ant-design/icons';
import { IconButton, IconButtonProps } from './button';
import { Translation } from 'locales/utils';

export const SaveIconButton = ({
  color = 'primary',
  icon = <SaveOutlined />,
  variant = 'outlined',
  tooltipProps = { title: Translation.get('common.action.save') },
  ...rest
}: IconButtonProps) => {
  return (
    <IconButton color={color} icon={icon} tooltipProps={tooltipProps} variant={variant} {...rest} />
  );
};

