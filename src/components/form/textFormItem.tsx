import React from 'react';
import { Form, FormItemProps, Input } from 'antd';
import { useFormItemIntlProps, useTextControlPlaceHolder } from './use-form-item-props';

export const TextFormItem = (props: FormItemProps) => {
  const { children, ...rest } = props;
  const placeholder = useTextControlPlaceHolder(props.label);
  return (
    <Form.Item {...useFormItemIntlProps(rest)}>
      {children ?? <Input placeholder={placeholder} />}
    </Form.Item>
  );
};
