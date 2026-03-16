import React from 'react';
import { AlarmLevel, getColorByValue, getLabelByValue } from './alarmLevel';
import { Tag } from 'antd';
import { Translation } from 'locales/utils';

export const AlarmLevelTag = ({ level }: { level: AlarmLevel }) => {
  return <Tag color={getColorByValue(level)}>{Translation.get(getLabelByValue(level))}</Tag>;
};
