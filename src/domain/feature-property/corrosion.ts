import { DisplayProperty, SIGNAL_QUALITY, SIGNAL_STRENGTH, TEMPERATURE, TOF } from './common';

const THICKNESS: DisplayProperty = {
  key: 'thickness',
  name: 'FIELD_THICKNESS',
  first: true,
  interval: 0.2,
  precision: 3,
  unit: 'mm'
};
const CORROSION_RATE: DisplayProperty = {
  key: 'corrosion_rate',
  name: 'FIELD_CORROSION_RATE',
  first: true,
  precision: 3,
  unit: 'mm/a'
};
const CORROSION_LOSS: DisplayProperty = {
  key: 'corrosion_loss',
  name: 'FIELD_CORROSION_LOSS',
  interval: 0.2,
  precision: 3,
  unit: 'mm',
  min: 0
};

export const DC = {
  Thickness: THICKNESS,
  properties: [
    THICKNESS,
    CORROSION_RATE,
    TOF,
    { ...TEMPERATURE, defaultFirstFieldKey: 'temperature', onlyShowFirstField: true },
    CORROSION_LOSS,
    SIGNAL_STRENGTH,
    SIGNAL_QUALITY
  ]
};

export const DC_ULTRA_HIGH_TEMPERATURE = {
  properties: [
    THICKNESS,
    CORROSION_RATE,
    TOF,
    {
      ...TEMPERATURE,
      fields: [
        {
          name: 'FIELD_TEMPERATURE',
          key: 'temperature',
          dataIndex: 1,
          alias: 'contact.temperature'
        },
        {
          name: 'FIELD_ENVIRONMENT_TEMPERATURE',
          key: 'env_temperature',
          dataIndex: 3,
          alias: 'rod.top.temperature'
        }
      ]
    },
    CORROSION_LOSS,
    SIGNAL_STRENGTH,
    SIGNAL_QUALITY
  ]
};
