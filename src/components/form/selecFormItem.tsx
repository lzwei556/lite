import React from 'react';
import { Form, FormItemProps, Select, SelectProps } from 'antd';
import { useFormItemIntlProps, useSelectControlPlaceHolder } from './use-form-item-props';

export const SelectFormItem = (props: FormItemProps & { selectProps?: SelectProps }) => {
  const { children, selectProps, ...rest } = props;
  const ph = useSelectControlPlaceHolder(props.label);
  const { placeholder = ph, popupMatchSelectWidth = false, ...selectRestProps } = selectProps || {};
  return (
    <Form.Item {...useFormItemIntlProps(rest)}>
      {children ?? (
        <Select
          placeholder={placeholder}
          popupMatchSelectWidth={popupMatchSelectWidth}
          {...selectRestProps}
        />
      )}
    </Form.Item>
  );
};
