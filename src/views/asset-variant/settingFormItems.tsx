import React from 'react';
import { ColProps } from 'antd';
import { motor } from './constants';
import { Settings as MotorSettings } from './motor/settings';

export const SettingFormItems = ({
  type,
  formItemColProps
}: {
  type: number;
  formItemColProps?: ColProps;
}) => {
  if (type === motor.type) {
    return <MotorSettings formItemColProps={formItemColProps} />;
  } else {
    return null;
  }
};
