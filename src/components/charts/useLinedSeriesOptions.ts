import * as echarts from 'echarts/core';
import _ from 'lodash';
import { roundValue } from '../../utils/format';
import { useYAxisOptions } from './useYAxisOptions';
import type { LineSeriesOption } from 'echarts/charts';
import type { ECOptions, ECSerionOptions } from './chart';
import type { YAxisMeta } from './useYAxisOptions';
import { chartColors } from './utils';

export interface SeriesOption {
  data: { [name: string]: number[] };
  raw?: ECSerionOptions;
  xAxisValues: string[] | number[];
}

export function useLinedSeriesOptions(
  serieOpts: SeriesOption[],
  yAxisMeta?: YAxisMeta,
  config?: { opts?: ECOptions; switchs?: { noDataZoom?: boolean; noArea?: boolean } }
): ECOptions {
  const options = config?.opts;
  const dataZoom = config?.switchs?.noDataZoom
    ? undefined
    : [
        {
          type: 'slider',
          start: 70,
          end: 100
        }
      ];
  const dataset = serieOpts.map((s) => {
    return { source: { x: s.xAxisValues, ...s.data } };
  });
  const legend = getLegend(serieOpts);
  const series = getSeries(serieOpts, !config?.switchs?.noArea);
  const yAxis = useYAxisOptions(yAxisMeta, options?.yAxis);
  const defaultOpts: ECOptions = {
    dataset,
    dataZoom,
    legend,
    series,
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value) => {
        const suffix = yAxisMeta?.unit;
        const roundedValue = roundValue(value as number, yAxisMeta?.precision);
        return suffix ? `${roundedValue} ${suffix}` : `${roundedValue}`;
      }
    },
    xAxis: {
      type: 'category',
      axisLabel: { align: 'left', hideOverlap: true },
      boundaryGap: false
    },
    yAxis
  };
  return _.merge(defaultOpts, options);
}

const getLegend = (series: SeriesOption[]) => {
  let legend;
  if (series.length > 1) {
    legend = {};
    if (series.length > 3) {
      legend = { bottom: 0, type: 'scroll' };
    }
  }
  return legend;
};

const getSeries = (series: SeriesOption[], withArea?: boolean): LineSeriesOption[] => {
  return series.map((s, i) => {
    const options = {
      type: 'line',
      colorBy: 'series',
      datasetIndex: i,
      emphasis: { focus: 'series' },
      showSymbol: false,
      ...s.raw
    } as LineSeriesOption;
    return withArea ? { ...options, ...setAreaStyle(chartColors[i]) } : options;
  });
};

function setAreaStyle(color: string) {
  const areaStyle = {
    opacity: 0.6,
    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: color
      },
      {
        offset: 1,
        color: '#fff'
      }
    ])
  };
  return { areaStyle };
}
