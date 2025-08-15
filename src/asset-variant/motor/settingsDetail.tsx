import React from 'react';
import intl from 'react-intl-universal';
import { Descriptions } from '../../components';
import { getOptionLabelByValue, getValue } from '../../utils';
import {
  BearingModel,
  BearingType,
  MotorType,
  Mounting,
  NominalPower,
  RotationSpeed,
  VariableFrequencyDrive
} from './settings';

export const SettingsDetail = ({ settings }: { settings: any }) => {
  const getVariable = () => {
    const value = settings[VariableFrequencyDrive.name];
    const label = getOptionLabelByValue(VariableFrequencyDrive.options!, value);
    return intl.get(label).d(label);
  };
  const getMounting = () => {
    const value = settings[Mounting.name];
    const label = getOptionLabelByValue(Mounting.options!, value);
    return intl.get(label).d(label);
  };
  const getBearingType = () => {
    const value = settings[BearingType.name];
    const label = getOptionLabelByValue(BearingType.options!, value);
    return intl.get(label).d(label);
  };

  return (
    <Descriptions
      items={[
        { label: intl.get(MotorType.label), children: settings[MotorType.name] },
        {
          label: intl.get(RotationSpeed.label),
          children: getValue({ value: settings[RotationSpeed.name], unit: RotationSpeed.unit })
        },
        {
          label: intl.get(VariableFrequencyDrive.label),
          children: getVariable()
        },
        {
          label: intl.get(NominalPower.label),
          children: getValue({ value: settings[NominalPower.name], unit: NominalPower.unit })
        },
        {
          label: intl.get(Mounting.label),
          children: getMounting()
        },
        {
          label: intl.get(BearingType.label),
          children: getBearingType()
        },
        { label: intl.get(BearingModel.label), children: settings[BearingModel.name] }
      ]}
    />
  );
};
