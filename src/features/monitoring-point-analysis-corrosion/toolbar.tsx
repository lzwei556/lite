import React from 'react';
import { Space } from 'antd';
import Icon from '@ant-design/icons';
import { Translation } from 'locales/utils';
import { IconButton, IconButtonProps } from 'components';
import { ReactComponent as MouseSVG } from './mouse.svg';
import { ReactComponent as SelectSVG } from './select.svg';
import { MarkType } from '.';

const iconProps = { width: '1em', height: '1em', fill: 'currentcolor' };

const PointMarkSwitcherIconButton = (props: IconButtonProps) => {
  return (
    <IconButton
      icon={<Icon component={() => <MouseSVG {...iconProps} />} />}
      tooltipProps={{ title: Translation.get('button.chart.toolbar.click') }}
      {...props}
    />
  );
};

const AreaMarkSwitcherIconButton = (props: IconButtonProps) => {
  return (
    <IconButton
      icon={<Icon component={() => <SelectSVG {...iconProps} />} />}
      tooltipProps={{ title: Translation.get('button.chart.toolbar.brush') }}
      {...props}
    />
  );
};

export const Toolbar = ({
  point,
  area,
  markType
}: {
  point: IconButtonProps;
  area: IconButtonProps;
  markType: MarkType;
}) => {
  return (
    <Space size={4}>
      <PointMarkSwitcherIconButton
        {...point}
        color='primary'
        size='small'
        variant={markType === 'point' ? 'solid' : 'outlined'}
      />
      <AreaMarkSwitcherIconButton
        {...area}
        color='primary'
        size='small'
        variant={markType === 'area' ? 'solid' : 'outlined'}
      />
    </Space>
  );
};
