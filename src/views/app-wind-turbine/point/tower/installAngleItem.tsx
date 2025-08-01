import React from 'react';
import { NumberFormItem } from '../../../../components';

export const InstallAngletItem = ({
  name,
  restFields
}: {
  name?: number;
  restFields?: {
    fieldKey?: number | undefined;
  };
}) => {
  const commonNameProp = ['attributes', 'tower_install_angle'];
  const nameProp = name !== undefined ? [name, ...commonNameProp] : commonNameProp;

  return (
    <NumberFormItem
      {...restFields}
      label='TOWER_INSTALL_ANGLE'
      name={nameProp}
      inputNumberProps={{ addonAfter: '°', min: -180, max: 180 }}
    />
  );
};
