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
import { TMonitoringPoint, OMonitoringPoint } from 'domain/monitoring-point';
import { AxisOption } from 'domain/axis';

export const MonitoringPointWaveform = (props: TMonitoringPoint.Base) => {
  const { getAxisSelectProps, getPropertiesSelectProps, vibrationFilters, ...rest } =
    useVibrationProps(props);
  const isTypeVibration = OMonitoringPoint.Type.Category.getTypes(['vibration']).includes(props.type);

  return (
    <WaveformContainer {...props} vibrationFilters={isTypeVibration ? vibrationFilters : undefined}>
      {(params) => {
        if (OMonitoringPoint.Type.Category.getTypes(['corrosion', 'preload']).includes(props.type)) {
          return <Ultrasound {...params} />;
        } else if (OMonitoringPoint.Type.Category.getTypes(['inclination']).includes(props.type)) {
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

const useVibrationProps = ({ attributes, type }: TMonitoringPoint.Base) => {
  const { axis, setAxis, options } =
    OMonitoringPoint.Settings.Vibration.useAxisWithVibrationDirection(
      attributes as TMonitoringPoint.Settings.VibrationDirection
    );
  const { properties } = monitoringPointTypeWaveformMap[type as WaveformMonitoringPointKey];
  const [property, setProperty] = React.useState(properties[0]);
  return {
    axis,
    getAxisSelectProps: (fetchData: FetchData) => {
      return {
        onChange: (value: AxisOption['value']) => {
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
