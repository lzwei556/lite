import React from 'react';
import { Translation } from 'locales/utils';

import { alarmLevelOptions } from '..';
import { SelectFormItem } from '../../../components';

export const SeverityFormItem = ({ nameIndex }: { nameIndex: number }) => {
  return (
    <SelectFormItem
      name={[nameIndex, 'level']}
      noStyle
      selectProps={{
        options: alarmLevelOptions.map((o) => ({ ...o, label: Translation.get(o.label) }))
      }}
    />
  );
};
