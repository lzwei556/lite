import React from 'react';
import { TextFormItem } from '../../../components';

export const NameFormItem = ({
  disabled,
  nameIndex
}: {
  disabled?: boolean;
  nameIndex: number;
}) => {
  return (
    <TextFormItem
      name={[nameIndex, 'name']}
      noStyle
      rules={[{ required: true }]}
      inputProps={{ disabled }}
    />
  );
};
