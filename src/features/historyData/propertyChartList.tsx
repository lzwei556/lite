import React from 'react';
import { DisplayProperty } from '../../constants/properties';
import { LineChart, LineChartProps, SeriesOption } from '../../components';
import dayjs from '../../utils/dayjsUtils';
import { hasData, HistoryData } from '../../views/asset-common';
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
        const transformed = transform(data, property, { prefix: name });
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
          .map((t) => dayjs.unix(t).local().format('YYYY-MM-DD HH:mm:ss'))
      }
    };
  };
  const { series, xAxis } = getOptions();
  return <LineChart {...rest} series={series} yAxisMeta={property} config={{ opts: { xAxis } }} />;
};
