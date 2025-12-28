import React from 'react';
import { ProcessType } from './types';
import { NumberFormItem, SelectFormItem, TextFormItem } from '../components';

export const ParameterFormItem = (props: ProcessType['parameters'][0]) => {
  const { name, label, rules, disabled, ...rest } = props;
  const { type, options, unit } = rest;
  const commonProps = { name, label, rules };
  if (options) {
    return <SelectFormItem {...commonProps} selectProps={{ options, disabled }} />;
  } else {
    if (type === 'number') {
      return <NumberFormItem {...commonProps} inputNumberProps={{ addonAfter: unit }} />;
    } else {
      return <TextFormItem {...commonProps} inputProps={{ addonAfter: unit }} />;
    }
  }
};
