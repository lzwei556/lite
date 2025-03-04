import React from 'react';
import { Form, InputNumber, Select } from 'antd';
import intl from 'react-intl-universal';
import { FormInputItem, FormInputItemProps } from '../../../components/formInputItem';

export const ConditionFormItem = ({
  nameIndex,
  unitText,
  ...rest
}: FormInputItemProps & {
  nameIndex: number;
  unitText?: string;
}) => {
  return (
    <FormInputItem
      {...rest}
      label={intl.get('CONDITION')}
      name={[nameIndex, 'threshold']}
      noStyle
      numericRule={{
        isInteger: false
      }}
      numericChildren={
        <InputNumber
          addonBefore={
            <Form.Item {...rest} name={[nameIndex, 'operation']} noStyle initialValue={'>='}>
              <Select style={{ width: 65 }}>
                <Select.Option key={'>'} value={'>'}>
                  &gt;
                </Select.Option>
                <Select.Option key={'>='} value={'>='}>
                  &gt;=
                </Select.Option>
                <Select.Option key={'<'} value={'<'}>
                  &lt;
                </Select.Option>
                <Select.Option key={'<='} value={'<='}>
                  &lt;=
                </Select.Option>
              </Select>
            </Form.Item>
          }
          controls={false}
          addonAfter={unitText}
          placeholder={intl.get('PLEASE_ENTER_SOMETHING', {
            something: intl.get('CONDITION')
          })}
        />
      }
      requiredMessage={' '}
    />
  );
};
