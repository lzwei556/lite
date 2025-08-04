import React from 'react';
import { ColProps } from 'antd';
import { motor } from './constants';
import { Settings as MotorSettings } from './motor/settings';
import { CardProps } from '../components';

export const SettingFormItems = ({
  type,
  cardProps,
  formItemColProps
}: {
  type: number;
  cardProps?: CardProps;
  formItemColProps?: ColProps;
}) => {
  if (type === motor.type) {
    return <MotorSettings cardProps={cardProps} formItemColProps={formItemColProps} />;
  } else {
    return null;
  }
};
