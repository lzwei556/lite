import React from 'react';
import intl from 'react-intl-universal';
import { HistoryData } from '../../asset-common';
import { DisplayProperty } from '../../constants/properties';
import { Dayjs } from '../../utils';
import { Chart, useLinedSeriesOptions, ChartProps, getOptions } from '../../components';
import { AlarmLevel } from '../alarm';

export const PropertyChart = (
  props: {
    data?: HistoryData;
    property: DisplayProperty;
    axisKey?: string;
    config?: { opts?: ChartProps['options']; switchs?: { noDataZoom?: boolean; noArea?: boolean } };
    alarm?: {
      propertyKey: string;
      rules: { value: number; condition: '>' | '>=' | '<' | '<='; level: AlarmLevel }[];
    };
  } & Omit<ChartProps, 'options'>
) => {
  const { data, property, config, axisKey, alarm, ...rest } = props;
  const transformed = transform(data, property, undefined, axisKey);
  const seriesIndex = getIndex(alarm?.propertyKey, property.fields);
  const options = getOptions(
    useLinedSeriesOptions({
      series: transformed?.series,
      yAxisMeta: {
        precision: property.precision,
        interval: property.interval,
        unit: property.unit,
        max: transformed?.max,
        min: transformed?.min,
        startValue: property.min
      },
      config,
      alarm: alarm ? { rules: alarm.rules, seriesIndex } : undefined
    })
  );
  return <Chart {...rest} options={options} />;
};

export function transform(
  origin: HistoryData | undefined | null,
  property: DisplayProperty,
  naming?: { replace?: string; prefix?: string },
  axisKey?: string
) {
  if (!origin || origin.length === 0) return { series: [], values: [] };
  const xAxisValues = origin.map(({ timestamp }) => Dayjs.format(timestamp));
  const series =
    property.fields
      ?.filter((f) =>
        property.onlyShowFirstField
          ? f.first
          : axisKey
          ? f.key === `${property.key}_${axisKey}`
          : true
      )
      .map((f) => {
        let seriesName = property.onlyShowFirstField
          ? intl.get(property.name)
          : intl.get(f.alias ?? f.name);
        if (naming) {
          const { replace, prefix } = naming;
          if (replace) {
            seriesName = replace;
          } else if (prefix) {
            seriesName = `${prefix}${seriesName}`;
          }
        }
        return {
          [seriesName]: origin.map(({ values }) => {
            const value = values.find((v) =>
              property.parentKey ? v.key === property.parentKey : v.key === property.key
            );
            return value?.data?.[f.name] ?? NaN;
          })
        };
      }) ?? [];
  const values = series.map((s) => {
    const [name, data] = Object.entries(s)[0];
    const validData = data.filter((d) => !Number.isNaN(d));
    return {
      name,
      last: data[data.length - 1],
      min: property.min ?? Math.min(...validData),
      max: Math.max(...validData)
    };
  });
  return {
    series: series.map((s) => {
      return { data: s, xAxisValues };
    }),
    values,
    min: values[0]?.min,
    max: values[0]?.max
  };
}

function getIndex(key?: string, fields?: DisplayProperty['fields']) {
  if (!key || !fields || fields.length === 0) {
    return 0;
  }
  let seriesIndex = 0;
  for (let index = 0; index < fields.length; index++) {
    if (fields[index].key === key) {
      seriesIndex = index;
      break;
    }
  }
  return seriesIndex;
}
