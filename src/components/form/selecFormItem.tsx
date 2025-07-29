import React from 'react';
import { Form, FormItemProps, Select, SelectProps } from 'antd';
import { useFormItemIntlProps } from './use-form-item-props';

export const SelectFormItem = (props: FormItemProps & { selectProps?: SelectProps }) => {
  const { children, selectProps, ...rest } = props;

  const { popupMatchSelectWidth = false, ...selectRestProps } = selectProps || {};
  return (
    <Form.Item {...useFormItemIntlProps(rest)}>
      {children ?? <Select popupMatchSelectWidth={popupMatchSelectWidth} {...selectRestProps} />}
    </Form.Item>
  );
};
