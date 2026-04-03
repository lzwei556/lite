import { VibrationDirection } from 'domain/vibration-direction';
import { BaseInclination, SA, SAS, TopInclination } from './bolt';
import {
  DisaplyFieldProperty,
  DisplayProperty,
  INCLINATION,
  PITCH,
  ROLL,
  SIGNAL_QUALITY,
  SIGNAL_STRENGTH,
  TEMPERATURE,
  TOF,
  WAGGLE
} from './common';
import { DC, DC_ULTRA_HIGH_TEMPERATURE } from './corrosion';
import { SVT_AUDIO, SVT_RS485, SVT_WIRELESS } from './vibration';
import { TMonitoringPoint } from 'domain/monitoring-point';
import _ from 'lodash';

export namespace Feature {
  export type Property = DisplayProperty;
  export type FieldProperty = DisaplyFieldProperty;
}

export const FeatureProperty = {
  SA,
  SAS,
  DS: { properties: SAS.properties.slice(0, SAS.properties.length - 1) },
  DC,
  DC_HIGH_TEMPERATURE: DC,
  DC_ULTRA_HIGH_TEMPERATURE,
  SVT_WIRELESS,
  SVT_RS485,
  SVT_AUDIO,
  ST: { properties: [TEMPERATURE] },
  SPT: {
    properties: [
      { key: 'pressure', name: 'FIELD_PRESSURE2', precision: 1, unit: 'MPa', first: true },
      TEMPERATURE
    ]
  },
  SQ: {
    properties: [
      { ...INCLINATION, first: true },
      { ...PITCH, first: true },
      { ...ROLL, first: true },
      WAGGLE,
      { ...TEMPERATURE, first: false }
    ]
  },
  TopInclination,
  BaseInclination,
  OilFiller: {
    properties: [
      {
        key: 'remaining_oil',
        name: 'FIELD_REMAINING_OIL',
        first: true,
        precision: 1,
        unit: '%'
      }
    ]
  },
  Temperature: TEMPERATURE,
  Tof: TOF,
  SignalQuality: SIGNAL_QUALITY,
  SignalStrength: SIGNAL_STRENGTH,
  Inclination: INCLINATION,
  Pitch: PITCH,
  Roll: ROLL,
  Waggle: WAGGLE,
  appendVibrationDirectionAbbr: (
    origin: DisplayProperty['fields'],
    attrs?: TMonitoringPoint.Base['attributes']
  ) => {
    const fields: DisplayProperty['fields'] = [];
    if (origin && origin.length > 1) {
      VibrationDirection.Options.forEach(({ key, abbr }) => {
        const axisKey = (attrs as TMonitoringPoint.Settings.VibrationDirection)?.[key];
        const field = origin.find(({ key }) => key.split('_').includes(axisKey));
        if (field) {
          fields.push({ ...field, alias: abbr });
        }
      });
    }
    return origin && fields.length === origin.length && fields.length > 1 ? fields : origin;
  },
  getGrouped(properties: readonly DisplayProperty[]) {
    return Object.entries(_.groupBy(properties, (p) => p.group));
  }
};
