import React from 'react';
import { NumberFormItem } from '../../../../components';
import { TowerInstallHeight } from '../../../../monitoring-point';

export const InstallHeightItem = ({
  nameIndex,
  ...rest
}: {
  nameIndex?: number;
  fieldKey?: number | undefined;
}) => {
  const commonNameProp = ['attributes', TowerInstallHeight.name];
  const nameProp = nameIndex !== undefined ? [nameIndex, ...commonNameProp] : commonNameProp;

  return (
    <NumberFormItem
      {...rest}
      label={TowerInstallHeight.label}
      name={nameProp}
      inputNumberProps={{ addonAfter: TowerInstallHeight.unit, min: 0 }}
    />
  );
};
