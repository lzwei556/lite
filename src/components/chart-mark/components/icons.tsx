import React from 'react';
import { Button, ButtonProps } from 'antd';
import Icon, { ReloadOutlined } from '@ant-design/icons';
import { ReactComponent as MouseSVG } from './mouse.svg';
import { ReactComponent as SelectSVG } from './select.svg';

const iconProps = { width: '1em', height: '1em', fill: 'currentcolor' };

export const PointMarkSwitcherIconButton = (props: ButtonProps) => {
  return <IconButton {...props} icon={<Icon component={() => <MouseSVG {...iconProps} />} />} />;
};

export const AreaMarkSwitcherIconButton = (props: ButtonProps) => {
  return <IconButton {...props} icon={<Icon component={() => <SelectSVG {...iconProps} />} />} />;
};

export const ReloadIconButton = (props: ButtonProps) => {
  return <IconButton {...props} icon={<ReloadOutlined />} />;
};

function IconButton(props: ButtonProps) {
  return <Button {...props} color='primary' variant='filled' />;
}
