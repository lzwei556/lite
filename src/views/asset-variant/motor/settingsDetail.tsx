import React from 'react';
import intl from 'react-intl-universal';
import { Descriptions } from '../../../components';

export const SettingsDetail = ({ settings }: { settings: any }) => {
  return (
    <Descriptions
      items={[
        { label: intl.get(`motor.motor_type`), children: settings['motor_type'] },
        { label: intl.get(`motor.rotation_speed`), children: `${settings['rotation_speed']}RPM` },
        {
          label: intl.get(`motor.variable_frequency_drive`),
          children: settings['variable_frequency_drive'] ? '是' : '否'
        },
        { label: intl.get(`motor.nominal_power`), children: `${settings['nominal_power']}kW` },
        {
          label: intl.get(`motor.mounting`),
          children: settings['mounting'] === 1 ? '水平' : '垂直'
        },
        {
          label: intl.get(`motor.bearing_type`),
          children: settings['bearing_type'] === 1 ? '滚动轴承' : '滑动轴承'
        },
        { label: intl.get(`motor.bearing_model`), children: settings['bearing_model'] }
      ]}
    />
  );
};
