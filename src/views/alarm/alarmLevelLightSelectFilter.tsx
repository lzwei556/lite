import React from 'react';
import { SelectProps } from 'antd';
import intl from 'react-intl-universal';
import { LightSelectFilter } from '../../components';
import { alarmLevelOptions } from '.';

export const AlarmLevelLightSelectFilter = (props: Pick<SelectProps, 'onChange' | 'value'>) => {
  return (
    <LightSelectFilter
      {...props}
      mode='multiple'
      options={alarmLevelOptions.map((o) => ({ ...o, label: intl.get(o.label) }))}
      prefix={intl.get('ALARM_LEVEL')}
    />
  );
};
