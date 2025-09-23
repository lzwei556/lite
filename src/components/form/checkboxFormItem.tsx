import React from 'react';
import { Checkbox, Form, FormItemProps } from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import { useFormItemIntlProps } from './use-form-item-props';

export const CheckboxFormItem = (
  props: FormItemProps & { checkboxGroupProps?: CheckboxGroupProps }
) => {
  const { children, checkboxGroupProps, ...rest } = props;

  return (
    <Form.Item {...useFormItemIntlProps(rest)}>
      {children ?? <Checkbox.Group {...checkboxGroupProps} />}
    </Form.Item>
  );
};
