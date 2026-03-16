import React from 'react';
import { FetchData, WaveformLayout } from './layout';
import { Ultrasound } from './ultrasound';
import { Inclination } from './inclination';
import { Vibration } from './vibration';
import {
  Axis,
  MonitoringPoint,
  MonitoringPointType,
  useAxisWithVibrationDirection,
  VibrationDirectionAttributes
} from 'common';
import { monitoringPointTypeWaveformMap, WaveformMonitoringPointKey } from './common';
import { VibrationPropertyKey } from '../types';
import { Translation } from 'locales/utils';
import { PropertyLightSelectFilter } from 'asset-common';
import { Select } from 'antd';

export const MonitoringPointWaveform = (props: MonitoringPoint) => {
  const { getAxisSelectProps, getPropertiesSelectProps, vibrationFilters, ...rest } =
    useVibrationProps(props);
  const isTypeVibration = MonitoringPointType.Categories.getKeys(['vibration']).includes(
    props.type
  );

  return (
    <WaveformLayout {...props} vibrationFilters={isTypeVibration ? vibrationFilters : undefined}>
      {(params) => {
        if (MonitoringPointType.Categories.getKeys(['corrosion', 'preload']).includes(props.type)) {
          return <Ultrasound {...params} />;
        } else if (MonitoringPointType.Categories.getKeys(['inclination']).includes(props.type)) {
          return <Inclination {...params} />;
        } else if (isTypeVibration) {
          return (
            <Vibration
              {...{
                ...params,
                ...rest,
                filters: [
                  <PropertyLightSelectFilter {...getPropertiesSelectProps(params.fetchData)} />,
                  <Select {...getAxisSelectProps(params.fetchData)} />
                ]
              }}
            />
          );
        }
      }}
    </WaveformLayout>
  );
};

const useVibrationProps = ({ attributes, type }: MonitoringPoint) => {
  const { axis, setAxis, options } = useAxisWithVibrationDirection(
    attributes as VibrationDirectionAttributes
  );
  const { properties } = monitoringPointTypeWaveformMap[type as WaveformMonitoringPointKey];
  const [property, setProperty] = React.useState(properties[0]);
  return {
    axis,
    getAxisSelectProps: (fetchData: FetchData) => {
      return {
        onChange: (value: Axis.Option['value']) => {
          const axis = options.find((o) => o.value === value);
          if (axis) {
            setAxis(axis);
            fetchData({ calculate: property.key as VibrationPropertyKey, dimension: axis.value });
          }
        },
        options: options.map((o) => ({ label: Translation.get(o.label), value: o.value })),
        popupMatchSelectWidth: false,
        value: axis.value
      };
    },
    property,
    getPropertiesSelectProps: (fetchData: FetchData) => {
      return {
        onChange: (value: VibrationPropertyKey) => {
          const property = properties.find((p) => p.key === value);
          if (property) {
            setProperty(property);
            fetchData({ calculate: property.key as VibrationPropertyKey, dimension: axis.value });
          }
        },
        properties,
        value: property.key
      };
    },
    vibrationFilters: { calculate: property.key as VibrationPropertyKey, dimension: axis.value }
  };
};
