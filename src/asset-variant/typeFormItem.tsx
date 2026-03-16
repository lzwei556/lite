import React from 'react';
import { SelectFormItem } from '../components';
import { AssetCategory } from '../asset-common';
import { Translation } from 'locales/utils';

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
      label='common.type'
      name='type'
      rules={[{ required: true }]}
      selectProps={{
        ...rest,
        options: types.map((t) => ({ label: Translation.get(t.label), value: t.type }))
      }}
    />
  );
};

