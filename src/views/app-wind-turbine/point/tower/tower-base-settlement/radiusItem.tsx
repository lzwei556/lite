import React from 'react';
import { NumberFormItem } from '../../../../../components';

export const RadiusItem = ({
  name,
  restFields
}: {
  name?: number;
  restFields?: {
    fieldKey?: number | undefined;
  };
}) => {
  const commonNameProp = ['attributes', 'tower_base_radius'];
  const nameProp = name !== undefined ? [name, ...commonNameProp] : commonNameProp;

  return (
    <NumberFormItem
      {...restFields}
      label='TOWER_BASE_RADIUS'
      name={nameProp}
      inputNumberProps={{ addonAfter: 'm', min: 0 }}
    />
  );
};
