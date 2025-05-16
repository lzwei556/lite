import React from 'react';
import intl from 'react-intl-universal';
import { HistoryData } from '../../views/asset-common';
import { DisplayProperty } from '../../constants/properties';
import { Dayjs } from '../../utils';
import { roundValue } from '../../utils/format';
import { Chart, useLinedSeriesOptions, ChartProps, getOptions } from '../../components';

export const PropertyChart = (
  props: {
    data?: HistoryData;
    property: DisplayProperty;
    config?: { opts?: ChartProps['options']; switchs?: { noDataZoom?: boolean; noArea?: boolean } };
  } & Omit<ChartProps, 'options'>
) => {
  const { data, property, config, ...rest } = props;
  const transformed = transform(data, property);
  const options = getOptions(
    useLinedSeriesOptions(
      transformed?.series,
      {
        precision: property.precision,
        interval: property.interval,
        unit: property.unit,
        max: transformed?.max,
        min: transformed?.min
      },
      config
    )
  );
  return <Chart {...rest} options={options} />;
};

export function transform(
  origin: HistoryData | undefined | null,
  property: DisplayProperty,
  naming?: { replace?: string; prefix?: string }
) {
  if (!origin || origin.length === 0) return { series: [], values: [] };
  const xAxisValues = origin.map(({ timestamp }) => Dayjs.format(timestamp));
  const series =
    property.fields
      ?.filter((f) => (property.onlyShowFirstField ? f.first : true))
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
    const value = Object.values(s)[0];
    return {
      name: Object.keys(s)[0],
      last: value[value.length - 1],
      min: roundValue(Math.min(...value), property.precision),
      max: roundValue(Math.max(...value), property.precision)
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
