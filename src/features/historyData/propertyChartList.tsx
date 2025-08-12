import React from 'react';
import { DisplayProperty } from '../../constants/properties';
import { LineChart, LineChartProps, SeriesOption } from '../../components';
import { Dayjs } from '../../utils';
import { hasData, HistoryData } from '../../asset-common';
import { transform } from './propertyChart';

export const PropertyChartList = (
  props: {
    data?: {
      name: string;
      data: HistoryData;
    }[];
    property: DisplayProperty;
  } & Partial<LineChartProps>
) => {
  const { data, property, ...rest } = props;
  const getOptions = () => {
    const series: SeriesOption[] = [];
    const xAxisValues: number[] = [];
    if (hasData(data) && property) {
      data!.forEach(({ name, data }) => {
        xAxisValues.push(...data.map(({ timestamp }) => timestamp));
        const transformed = transform(
          data,
          { ...property, onlyShowFirstField: true },
          { replace: name }
        );
        if (transformed?.series) {
          series.push(...transformed.series);
        }
      });
    }
    return {
      series,
      xAxis: {
        data: Array.from(new Set(xAxisValues))
          .sort((prev, crt) => prev - crt)
          .map((t) => Dayjs.format(t))
      }
    };
  };
  const { series, xAxis } = getOptions();
  return <LineChart {...rest} series={series} yAxisMeta={property} config={{ opts: { xAxis } }} />;
};
