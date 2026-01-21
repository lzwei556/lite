import React from 'react';
import { ButtonProps } from 'antd';
import { ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { IconButton, IconButtonProps } from '../../icon-button';

const Common = ({
  color = 'primary',
  size = 'small',
  variant = 'outlined',
  ...rest
}: IconButtonProps) => <IconButton color={color} size={size} variant={variant} {...rest} />;

export const RestoreIconButton = (props: ButtonProps) => {
  return (
    <Common
      icon={<ReloadOutlined />}
      tooltipProps={{ title: intl.get('analysis.restore') }}
      {...props}
    />
  );
};

export const SettingsIconButton = (props: ButtonProps & { tooltip?: string }) => {
  return (
    <Common
      icon={<SettingOutlined />}
      tooltipProps={{ title: intl.get(props.tooltip ?? 'SETTINGS') }}
      {...props}
    />
  );
};
