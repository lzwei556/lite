import React from 'react';
import { Form, FormItemProps, Input, InputProps } from 'antd';
import { useFormItemIntlProps } from './use-form-item-props';

export const TextFormItem = (props: FormItemProps & { inputProps?: InputProps }) => {
  const { children, inputProps, ...rest } = props;

  return (
    <Form.Item {...useFormItemIntlProps(rest)}>{children ?? <Input {...inputProps} />}</Form.Item>
  );
};
