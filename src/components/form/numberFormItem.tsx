import React from 'react';
import { FormItemProps, InputNumber, InputNumberProps } from 'antd';
import { TextFormItem } from './textFormItem';

export type NumberFromItemProps = FormItemProps & { inputNumberProps?: InputNumberProps };

export const NumberFormItem = (props: NumberFromItemProps) => {
  const { inputNumberProps, rules: rulesFromProps, ...rest } = props;
  let rules = rulesFromProps ?? [];
  if (!rules.some((rule) => typeof rule !== 'function' && rule.type && rule.type === 'number')) {
    rules = [{ type: 'number' }, ...rules];
  }
  const { style = { width: '100%' }, ...inputNumberRestProps } = inputNumberProps || {};

  return (
    <TextFormItem {...{ ...rest, rules }}>
      <InputNumber {...{ style, ...inputNumberRestProps }} />
    </TextFormItem>
  );
};
