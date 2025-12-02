import React from 'react';
import { FetchData, WaveformLayout } from './layout';
import { Ultrasound } from './ultrasound';
import { Inclination } from './inclination';
import { Vibration } from './vibration';
import { Axis, MonitoringPointType } from 'common';
import { monitoringPointTypeWaveformMap, WaveformMonitoringPointKey } from './common';
import { VibrationPropertyKey } from '../types';
import intl from 'react-intl-universal';
import { PropertyLightSelectFilter } from 'asset-common';
import { Select } from 'antd';
import {
  getVibrationDirectionByAxisKey,
  VibrationDirectionAttributes
} from 'common/monitoring-point-attributes';

type Props = {
  id: number;
  type: WaveformMonitoringPointKey;
  vibrationDirectionAttrs: VibrationDirectionAttributes;
};

export const MonitoringPointWaveform = (props: Props) => {
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

const useVibrationProps = ({ vibrationDirectionAttrs, type }: Props) => {
  const options = Axis.OPTIONS.map((opt) => {
    const direction = getVibrationDirectionByAxisKey(opt.key, vibrationDirectionAttrs);
    return { ...opt, label: direction ? direction.label : opt.label } as Axis.Option;
  });
  const [axis, setAxis] = React.useState(options[0]);
  const { properties } = monitoringPointTypeWaveformMap[type];
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
