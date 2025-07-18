import React from 'react';
import { Form, FormItemProps, Select, SelectProps } from 'antd';
import { useFormItemIntlProps, useTextControlPlaceHolder } from './use-form-item-props';

export const SelectFormItem = (props: FormItemProps & { selectProps?: SelectProps }) => {
  const { children, selectProps, ...rest } = props;
  const placeholder = useTextControlPlaceHolder(props.label);
  return (
    <Form.Item {...useFormItemIntlProps(rest)}>
      {children ?? <Select placeholder={placeholder} {...selectProps} />}
    </Form.Item>
  );
};
