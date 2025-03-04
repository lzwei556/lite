import React from 'react';
import { Form, Select } from 'antd';
import intl from 'react-intl-universal';
import { FormInputItemProps } from '../../../components/formInputItem';
import { alarmLevelOptions } from '..';

export const SeverityFormItem = ({
  nameIndex,
  ...rest
}: FormInputItemProps & { nameIndex: number }) => {
  return (
    <Form.Item {...rest} name={[nameIndex, 'level']} noStyle initialValue={3}>
      <Select options={alarmLevelOptions.map((o) => ({ ...o, label: intl.get(o.label) }))} />
    </Form.Item>
  );
};
