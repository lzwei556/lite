import React from 'react';
import { IconButton, IconButtonProps } from './button';
import { DownloadOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';

export const DownloadIconButton = ({
  color = 'primary',
  icon = <DownloadOutlined />,
  variant = 'filled',
  tooltipProps = { title: intl.get('DOWNLOAD') },
  ...rest
}: IconButtonProps) => {
  return (
    <IconButton color={color} icon={icon} tooltipProps={tooltipProps} variant={variant} {...rest} />
  );
};
