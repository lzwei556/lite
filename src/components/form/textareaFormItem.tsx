import React from 'react';
import { Form, FormItemProps, Input } from 'antd';
import { useFormItemIntlProps } from './use-form-item-props';
import { TextAreaProps } from 'antd/es/input';

export const TextAreaFormItem = (props: FormItemProps & { textareaProps?: TextAreaProps }) => {
  const { children, textareaProps, ...rest } = props;

  return (
    <Form.Item {...useFormItemIntlProps(rest)}>
      {children ?? <Input.TextArea {...textareaProps} />}
    </Form.Item>
  );
};
