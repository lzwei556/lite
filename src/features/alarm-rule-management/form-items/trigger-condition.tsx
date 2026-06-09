import React from 'react';
import { NumberFormItem, SelectFormItem } from '../../../components';

export const ConditionFormItem = ({ nameIndex, unit }: { nameIndex: number; unit?: string }) => {
  return (
    <NumberFormItem
      label='CONDITION'
      name={[nameIndex, 'threshold']}
      noStyle
      rules={[{ required: true }]}
      inputNumberProps={{
        addonBefore: (
          <SelectFormItem
            name={[nameIndex, 'operation']}
            noStyle
            selectProps={{
              options: [
                { label: '>', value: '>' },
                { label: '>=', value: '>=' },
                { label: '<', value: '<' },
                { label: '<=', value: '<=' }
              ]
            }}
          />
        ),
        addonAfter: unit
      }}
    />
  );
};
