import React from 'react';
import { NumberFormItem } from '../../../../../components';

export const InstallHeightItem = ({
  name,
  restFields
}: {
  name?: number;
  restFields?: {
    fieldKey?: number | undefined;
  };
}) => {
  const commonNameProp = ['attributes', 'tower_install_height'];
  const nameProp = name !== undefined ? [name, ...commonNameProp] : commonNameProp;

  return (
    <NumberFormItem
      {...restFields}
      label='TOWER_INSTALL_HEIGHT'
      name={nameProp}
      inputNumberProps={{ addonAfter: 'm', min: 0 }}
    />
  );
};
