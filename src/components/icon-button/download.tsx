import React from 'react';
import { IconButton, IconButtonProps } from './button';
import { DownloadOutlined } from '@ant-design/icons';
import { Translation } from 'locales/utils';

export const DownloadIconButton = ({
  color = 'primary',
  icon = <DownloadOutlined />,
  variant = 'filled',
  tooltipProps = { title: Translation.get('common.action.download') },
  ...rest
}: IconButtonProps) => {
  return (
    <IconButton color={color} icon={icon} tooltipProps={tooltipProps} variant={variant} {...rest} />
  );
};

