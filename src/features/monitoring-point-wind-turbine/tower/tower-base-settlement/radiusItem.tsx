import React from 'react';
import { NumberFormItem } from '../../../../components';
import { TowerBaseRadius } from '../../../../monitoring-point';

export const RadiusItem = ({
  nameIndex,
  ...rest
}: {
  nameIndex?: number;
  fieldKey?: number | undefined;
}) => {
  const commonNameProp = ['attributes', TowerBaseRadius.name];
  const nameProp = nameIndex !== undefined ? [nameIndex, ...commonNameProp] : commonNameProp;

  return (
    <NumberFormItem
      {...rest}
      label={TowerBaseRadius.label}
      name={nameProp}
      inputNumberProps={{ addonAfter: TowerBaseRadius.unit, min: 0 }}
    />
  );
};
