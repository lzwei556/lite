import React from 'react';
import { SelectProps } from 'antd';
import { LightSelectFilter } from '../../components';
import { alarmLevelOptions } from '.';
import { Translation } from 'locales/utils';

export const AlarmLevelLightSelectFilter = (props: Pick<SelectProps, 'onChange' | 'value'>) => {
  return (
    <LightSelectFilter
      {...props}
      mode='multiple'
      options={alarmLevelOptions.map((o) => ({ ...o, label: Translation.get(o.label) }))}
      prefix={Translation.get('alarm.level')}
    />
  );
};

