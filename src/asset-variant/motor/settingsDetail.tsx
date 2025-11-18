import React from 'react';
import intl from 'react-intl-universal';
import { Descriptions } from '../../components';
import { getValue } from '../../utils';
import { envBand, gearTeeth, powerFreq, rotationSpeed } from './settings';

export const SettingsDetail = ({ settings }: { settings: any }) => {
  return (
    <Descriptions
      items={[
        {
          label: intl.get(rotationSpeed.label),
          children: getValue({ value: settings[rotationSpeed.name], unit: rotationSpeed.unit })
        },
        {
          label: intl.get(envBand.label),
          children: getValue({ value: settings[envBand.name], unit: envBand.unit })
        },
        {
          label: intl.get(powerFreq.label),
          children: getValue({ value: settings[powerFreq.name], unit: powerFreq.unit })
        },
        {
          label: intl.get(gearTeeth.label),
          children: getValue({ value: settings[gearTeeth.name], unit: gearTeeth.unit })
        }
      ]}
    />
  );
};
