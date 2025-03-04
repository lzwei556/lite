import React from 'react';
import { SeriesOption, useLinedSeriesOptions } from './useLinedSeriesOptions';
import { Chart, ChartProps } from './chart';
import { YAxisMeta } from './useYAxisOptions';
import { getOptions } from './utils';

export type LineChartProps = {
  series: SeriesOption[];
  yAxisMeta?: YAxisMeta;
  config?: { opts?: ChartProps['options']; switchs?: { noDataZoom?: boolean; noArea?: boolean } };
} & Omit<ChartProps, 'options'>;

export const LineChart = (props: LineChartProps) => {
  const { series, yAxisMeta, config, ...rest } = props;
  const options = getOptions(
    useLinedSeriesOptions(series, yAxisMeta, {
      ...config,
      switchs: { noDataZoom: true, noArea: true, ...config?.switchs }
    })
  );
  return <Chart {...rest} options={options} />;
};
