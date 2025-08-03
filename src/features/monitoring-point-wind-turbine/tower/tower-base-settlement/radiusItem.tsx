import React from 'react';
import { NumberFormItem } from '../../../../components';

export const RadiusItem = ({
  nameIndex,
  ...rest
}: {
  nameIndex?: number;
  fieldKey?: number | undefined;
}) => {
  const commonNameProp = ['attributes', 'tower_base_radius'];
  const nameProp = nameIndex !== undefined ? [nameIndex, ...commonNameProp] : commonNameProp;

  return (
    <NumberFormItem
      {...rest}
      label='TOWER_BASE_RADIUS'
      name={nameProp}
      inputNumberProps={{ addonAfter: 'm', min: 0 }}
    />
  );
};
