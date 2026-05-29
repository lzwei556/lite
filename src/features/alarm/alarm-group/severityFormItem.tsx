import React from 'react';
import intl from 'react-intl-universal';
import { SelectFormItem } from '../../../components';
import { options } from 'domain/alarm-level';

export const SeverityFormItem = ({ nameIndex }: { nameIndex: number }) => {
  return (
    <SelectFormItem
      name={[nameIndex, 'level']}
      noStyle
      selectProps={{ options: options.map((o) => ({ ...o, label: intl.get(o.label) })) }}
    />
  );
};
