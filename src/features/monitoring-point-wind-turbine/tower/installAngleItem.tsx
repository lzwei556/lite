import React from 'react';
import { NumberFormItem } from '../../../components';
import { TowerInstallAngle } from '../../../monitoring-point';

export const InstallAngletItem = ({
  nameIndex,
  ...rest
}: {
  nameIndex?: number;
  fieldKey?: number | undefined;
}) => {
  const commonNameProp = ['attributes', TowerInstallAngle.name];
  const nameProp = nameIndex !== undefined ? [nameIndex, ...commonNameProp] : commonNameProp;

  return (
    <NumberFormItem
      {...rest}
      label={TowerInstallAngle.label}
      name={nameProp}
      inputNumberProps={{ addonAfter: TowerInstallAngle.unit, min: -180, max: 180 }}
    />
  );
};
