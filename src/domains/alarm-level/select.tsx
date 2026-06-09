import React from 'react';
import { SelectProps } from 'antd';
import intl from 'react-intl-universal';
import { LightSelectFilter } from '../../components';
import { options } from './config';

export const AlarmLevelSelect = (props: Pick<SelectProps, 'onChange' | 'value'>) => {
  return (
    <LightSelectFilter
      {...props}
      mode='multiple'
      options={options.map((o) => ({ ...o, label: intl.get(o.label) }))}
      prefix={intl.get('ALARM_LEVEL')}
    />
  );
};
