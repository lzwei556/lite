import React from 'react';
import { ColProps } from 'antd';
import { motor } from './constants';
import { Settings as MotorSettings } from './motor/settings';

export const SettingFormItems = ({
  type,
  formItemColProps,
  velBaseFormItemColProps
}: {
  type: number;
  formItemColProps?: ColProps;
  velBaseFormItemColProps?: ColProps;
}) => {
  if (type === motor.type) {
    return (
      <MotorSettings
        formItemColProps={formItemColProps}
        velBaseFormItemColProps={velBaseFormItemColProps}
      />
    );
  } else {
    return null;
  }
};
