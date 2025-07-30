import React from 'react';
import { NumberFormItem, SelectFormItem } from '../../../components';

export const ConditionFormItem = ({
  nameIndex,
  unitText
}: {
  nameIndex: number;
  unitText?: string;
}) => {
  return (
    <NumberFormItem
      label='CONDITION'
      name={[nameIndex, 'threshold']}
      noStyle
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
        addonAfter: unitText
      }}
    />
  );
};
