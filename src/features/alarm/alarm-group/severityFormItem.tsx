import React from 'react';
import intl from 'react-intl-universal';

import { alarmLevelOptions } from '..';
import { SelectFormItem } from '../../../components';

export const SeverityFormItem = ({ nameIndex }: { nameIndex: number }) => {
  return (
    <SelectFormItem
      name={[nameIndex, 'level']}
      noStyle
      selectProps={{ options: alarmLevelOptions.map((o) => ({ ...o, label: intl.get(o.label) })) }}
    />
  );
};
