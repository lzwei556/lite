import React from 'react';
import { NumberFormItem } from '../../../components';

export const DurationFormItem = ({ nameIndex }: { nameIndex: number }) => {
  return (
    <NumberFormItem
      name={[nameIndex, 'duration']}
      noStyle
      rules={[{ required: true }]}
      inputNumberProps={{ min: 1 }}
    />
  );
};
