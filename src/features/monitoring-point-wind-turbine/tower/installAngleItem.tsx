import React from 'react';
import { NumberFormItem } from '../../../components';

export const InstallAngletItem = ({
  nameIndex,
  ...rest
}: {
  nameIndex?: number;
  fieldKey?: number | undefined;
}) => {
  const commonNameProp = ['attributes', 'tower_install_angle'];
  const nameProp = nameIndex !== undefined ? [nameIndex, ...commonNameProp] : commonNameProp;

  return (
    <NumberFormItem
      {...rest}
      label='TOWER_INSTALL_ANGLE'
      name={nameProp}
      inputNumberProps={{ addonAfter: '°', min: -180, max: 180 }}
    />
  );
};
