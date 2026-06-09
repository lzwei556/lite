import React from 'react';
import { FetchData, WaveformContainer } from './container';
import { Ultrasound } from './ultrasound';
import { Inclination } from './inclination';
import { Vibration } from './vibration';
import { monitoringPointTypeWaveformMap, WaveformMonitoringPointKey } from './common';
import { VibrationPropertyKey } from '../types';
import intl from 'react-intl-universal';
import { PropertyLightSelectFilter } from 'asset-common';
import { Select } from 'antd';
import * as MonitoringPoint from 'domains/monitoring-point';
import * as Axis from 'domains/axis';

export const MonitoringPointWaveform = (props: MonitoringPoint.Types.Entity) => {
  const { getAxisSelectProps, getPropertiesSelectProps, vibrationFilters, ...rest } =
    useVibrationProps(props);
  const isTypeVibration = MonitoringPoint.Type.Category.getTypes(['vibration']).includes(
    props.type
  );

  return (
    <WaveformContainer {...props} vibrationFilters={isTypeVibration ? vibrationFilters : undefined}>
      {(params) => {
        if (MonitoringPoint.Type.Category.getTypes(['corrosion', 'preload']).includes(props.type)) {
          return <Ultrasound {...params} />;
        } else if (MonitoringPoint.Type.Category.getTypes(['inclination']).includes(props.type)) {
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
    </WaveformContainer>
  );
};

const useVibrationProps = ({ attributes, type }: MonitoringPoint.Types.Entity) => {
  const { axis, setAxis, options } = MonitoringPoint.Hooks.useAxisWithVibrationDirection(
    attributes as MonitoringPoint.Settings.VibrationDirection
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
        options: options.map((o) => ({ label: intl.get(o.label), value: o.value })),
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
