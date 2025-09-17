import React from 'react';
import { FormItemProps, InputNumberProps, InputProps, RadioGroupProps, SelectProps } from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import { CheckboxFormItem } from './checkboxFormItem';
import { NumberFormItem } from './numberFormItem';
import { RadioFormItem } from './radioFormItem';
import { SelectFormItem } from './selectFormItem';
import { TextFormItem } from './textFormItem';

export const FormItem = (
  props: FormItemProps & {
    checkboxGroupProps?: CheckboxGroupProps;
    inputNumberProps?: InputNumberProps;
    inputProps?: InputProps;
    radioGroupProps?: RadioGroupProps;
    selectProps?: SelectProps;
  }
) => {
  const {
    checkboxGroupProps,
    inputNumberProps,
    inputProps,
    radioGroupProps,
    selectProps,
    ...rest
  } = props;
  if (checkboxGroupProps) {
    return <CheckboxFormItem checkboxGroupProps={checkboxGroupProps} {...rest} />;
  } else if (inputNumberProps) {
    return <NumberFormItem inputNumberProps={inputNumberProps} {...rest} />;
  } else if (radioGroupProps) {
    return <RadioFormItem radioGroupProps={radioGroupProps} {...rest} />;
  } else if (selectProps) {
    return <SelectFormItem selectProps={selectProps} {...rest} />;
  } else {
    return <TextFormItem inputProps={inputProps} {...rest} />;
  }
};
