import React from 'react';
import { Form, FormItemProps, Radio, RadioGroupProps } from 'antd';
import { useFormItemIntlProps } from './use-form-item-props';
import { Translation } from 'locales/utils';

export const RadioFormItem = (props: FormItemProps & { radioGroupProps?: RadioGroupProps }) => {
  const { children, radioGroupProps, ...rest } = props;
  const {
    buttonStyle = 'solid',
    options = [
      { label: Translation.get('common.enabled'), value: true },
      { label: Translation.get('common.disabled'), value: false }
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
