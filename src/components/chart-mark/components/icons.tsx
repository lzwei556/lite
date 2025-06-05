import React from 'react';
import { Button, ButtonProps, Tooltip } from 'antd';
import Icon, { DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { ReactComponent as MouseSVG } from './mouse.svg';
import { ReactComponent as SelectSVG } from './select.svg';

const iconProps = { width: '1em', height: '1em', fill: 'currentcolor' };

export const PointMarkSwitcherIconButton = (props: ButtonProps) => {
  return (
    <Tooltip title={intl.get('analysis.select.single')}>
      <IconButton {...props} icon={<Icon component={() => <MouseSVG {...iconProps} />} />} />
    </Tooltip>
  );
};

export const AreaMarkSwitcherIconButton = (props: ButtonProps) => {
  return (
    <Tooltip title={intl.get('analysis.select.double')}>
      <IconButton {...props} icon={<Icon component={() => <SelectSVG {...iconProps} />} />} />
    </Tooltip>
  );
};

export const ReloadIconButton = (props: ButtonProps) => {
  return (
    <Tooltip title={intl.get('analysis.refresh')}>
      <IconButton {...props} icon={<ReloadOutlined />} />
    </Tooltip>
  );
};

function IconButton(props: ButtonProps) {
  return <Button {...props} color='primary' variant='outlined' size='small' />;
}

export const DownloadIconButton = (props: ButtonProps & { tooltip?: string }) => {
  return (
    <Tooltip title={intl.get(props.tooltip ?? 'DOWNLOAD')}>
      <IconButton {...props} icon={<DownloadOutlined />} />
    </Tooltip>
  );
};
