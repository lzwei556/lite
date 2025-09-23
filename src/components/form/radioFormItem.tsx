import React from 'react';
import { Form, FormItemProps, Radio, RadioGroupProps } from 'antd';
import intl from 'react-intl-universal';
import { useFormItemIntlProps } from './use-form-item-props';

export const RadioFormItem = (props: FormItemProps & { radioGroupProps?: RadioGroupProps }) => {
  const { children, radioGroupProps, ...rest } = props;
  const {
    buttonStyle = 'solid',
    options = [
      { label: intl.get('ENABLED'), value: true },
      { label: intl.get('DISABLED'), value: false }
    ],
    optionType = 'button',
    ...radioGroupRestProps
  } = radioGroupProps || {};
  return (
    <Form.Item {...useFormItemIntlProps(rest)}>
      {children ?? (
        <Radio.Group
          buttonStyle={buttonStyle}
          options={options}
          optionType={optionType}
          {...radioGroupRestProps}
        />
      )}
    </Form.Item>
  );
};
