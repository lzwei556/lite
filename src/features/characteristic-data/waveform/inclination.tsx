import React from 'react';
import { WaveformData, WaveformInclination, WaveformProperty } from '../types';
import { Card, LineChart } from 'components';
import { PropertyLightSelectFilter } from 'asset-common';
import { Translation } from 'locales/utils';
import { monitoringPointTypeWaveformMap, WaveformMonitoringPointKey } from './common';

export const Inclination = (props: { data: WaveformData; type: WaveformMonitoringPointKey }) => {
  const { property, selectProps } = useCardProps(props.type);
  return (
    <Card extra={<PropertyLightSelectFilter {...selectProps} />}>
      <LineChart {...useChartProps({ data: props.data, property })} />
    </Card>
  );
};

const useCardProps = (type: WaveformMonitoringPointKey) => {
  const { properties } = monitoringPointTypeWaveformMap[type];
  const [property, setProperty] = React.useState(properties[0]);
  return {
    property,
    selectProps: {
      onChange: (key: string) => {
        const property = properties.find((p) => p.key === key);
        if (property) {
          setProperty(property);
        }
      },
      properties,
      value: property.key
    }
  };
};

const useChartProps = ({ data, property }: { data: WaveformData; property: WaveformProperty }) => {
  const properties = property.fields && property.fields.length > 0 ? property.fields : [property];
  return {
    series: properties.map((p) => {
      const propertyData = (data.values as WaveformInclination)[p.key as keyof WaveformInclination];
      return {
        data: { [Translation.get(p.name)]: propertyData },
        xAxisValues: propertyData.map((_, i) => `${i}`)
      };
    }),
    style: { height: 560 },
    yAxisMeta: property
  };
};
