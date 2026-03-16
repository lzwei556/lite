import React from 'react';
import { ButtonProps } from 'antd';
import { ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { IconButton, IconButtonProps } from '../../icon-button';
import { Translation } from 'locales/utils';

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
      tooltipProps={{ title: Translation.get('button.chart.toolbar.restore') }}
      {...props}
    />
  );
};

export const SettingsIconButton = (props: ButtonProps & { tooltip?: string }) => {
  return (
    <Common
      icon={<SettingOutlined />}
      tooltipProps={{ title: Translation.get(props.tooltip ?? 'common.settings') }}
      {...props}
    />
  );
};
