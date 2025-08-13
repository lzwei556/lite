import React from 'react';
import { ButtonProps } from 'antd';
import Icon, { ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { IconButton, IconButtonProps } from '../../icon-button';
import { ReactComponent as MouseSVG } from './mouse.svg';
import { ReactComponent as SelectSVG } from './select.svg';

const iconProps = { width: '1em', height: '1em', fill: 'currentcolor' };

const Common = ({
  color = 'primary',
  size = 'small',
  variant = 'outlined',
  ...rest
}: IconButtonProps) => <IconButton color={color} size={size} variant={variant} {...rest} />;

export const PointMarkSwitcherIconButton = (props: ButtonProps) => {
  return (
    <Common
      icon={<Icon component={() => <MouseSVG {...iconProps} />} />}
      tooltipProps={{ title: intl.get('analysis.select.single') }}
      {...props}
    />
  );
};

export const AreaMarkSwitcherIconButton = (props: ButtonProps) => {
  return (
    <Common
      icon={<Icon component={() => <SelectSVG {...iconProps} />} />}
      tooltipProps={{ title: intl.get('analysis.select.double') }}
      {...props}
    />
  );
};

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
