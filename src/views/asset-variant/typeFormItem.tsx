import React from 'react';
import intl from 'react-intl-universal';
import { SelectFormItem } from '../../components';
import { AssetCategory } from '../asset-common';

export const TypeFormItem = ({
  types,
  ...rest
}: {
  types: AssetCategory[];
  onChange?: (type: number) => void;
  disabled?: boolean;
}) => {
  return (
    <SelectFormItem
      label='TYPE'
      name='type'
      rules={[{ required: true }]}
      selectProps={{
        ...rest,
        options: types.map((t) => ({ label: intl.get(t.label), value: t.type }))
      }}
    />
  );
};
