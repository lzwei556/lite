import React from 'react';
import intl from 'react-intl-universal';
import { Enum, get } from './config';
import { Tag } from 'antd';

export const AlarmLevelTag = ({ level }: { level: Enum }) => {
  const config = get(level);
  return <Tag color={config.color}>{intl.get(config.label)}</Tag>;
};
