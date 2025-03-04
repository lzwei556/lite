import React from 'react';
import intl from 'react-intl-universal';
import { AlarmLevel, getColorByValue, getLabelByValue } from './alarmLevel';
import { Tag } from 'antd';

export const AlarmLevelTag = ({ level }: { level: AlarmLevel }) => {
  return <Tag color={getColorByValue(level)}>{intl.get(getLabelByValue(level))}</Tag>;
};
