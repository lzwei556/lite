import React from 'react';
import { NumberFormItem } from '../../../../../components';

export const InstallHeightItem = ({
  nameIndex,
  ...rest
}: {
  nameIndex?: number;
  fieldKey?: number | undefined;
}) => {
  const commonNameProp = ['attributes', 'tower_install_height'];
  const nameProp = nameIndex !== undefined ? [nameIndex, ...commonNameProp] : commonNameProp;

  return (
    <NumberFormItem
      {...rest}
      label='TOWER_INSTALL_HEIGHT'
      name={nameProp}
      inputNumberProps={{ addonAfter: 'm', min: 0 }}
    />
  );
};
