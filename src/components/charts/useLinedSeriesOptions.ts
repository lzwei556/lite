import * as echarts from 'echarts/core';
import _ from 'lodash';
import { getValue } from '../../utils/format';
import { useGlobalStyles } from '../../styles';
import { useYAxisOptions } from './useYAxisOptions';
import type { LineSeriesOption } from 'echarts/charts';
import type { ECOptions, ECSerionOptions } from './chart';
import type { YAxisMeta } from './useYAxisOptions';
import { chartColors } from './utils';
import { AlarmLevel, getColorByValue } from '../../features/alarm';

export interface SeriesOption {
  data: { [name: string]: number[] };
  raw?: ECSerionOptions;
  xAxisValues: string[] | number[];
}

export type SeriesAlarm = {
  seriesIndex: number;
  rules: { value: number; condition: '>' | '>=' | '<' | '<='; level: AlarmLevel }[];
};

export function useLinedSeriesOptions({
  series,
  yAxisMeta,
  config,
  alarm
}: {
  series: SeriesOption[];
  yAxisMeta?: YAxisMeta;
  config?: { opts?: ECOptions; switchs?: { noDataZoom?: boolean; noArea?: boolean } };
  alarm?: SeriesAlarm;
}): ECOptions {
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
  const dataset = series.map((s) => {
    return { source: { x: s.xAxisValues, ...s.data } };
  });
  const legend = useLegend(series);
  const _series = useSeries(series, !config?.switchs?.noArea);
  const visualMap = useVisualMap(alarm);
  const yAxis = useYAxisOptions(yAxisMeta, options?.yAxis);
  const opts: ECOptions = {
    dataset,
    dataZoom,
    legend,
    series: _series,
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value) =>
        getValue({
          value: value as number,
          precision: yAxisMeta?.precision,
          unit: yAxisMeta?.unit
        }),
      confine: true
    },
    xAxis: {
      type: 'category',
      axisLabel: { align: 'left', hideOverlap: true },
      boundaryGap: false
    },
    yAxis
  };
  const defaultOpts: ECOptions = visualMap ? { ...opts, visualMap } : opts;
  return _.merge(defaultOpts, options);
}

const useLegend = (series: SeriesOption[]) => {
  const styles = useLegendStyles();
  let legend;
  if (series.length > 1) {
    legend = { ...styles };
    if (series.length > 3) {
      legend = { ...styles, bottom: 0, type: 'scroll' };
    }
  }
  return legend;
};

export const useLegendStyles = () => {
  const { colorTextDescriptionStyle } = useGlobalStyles();
  return {
    textStyle: colorTextDescriptionStyle
  };
};

const useSeries = (series: SeriesOption[], withArea?: boolean): LineSeriesOption[] => {
  const { colorBgContainerStyle } = useGlobalStyles();
  return series.map((s, i) => {
    const options = {
      type: 'line',
      colorBy: 'series',
      datasetIndex: i,
      emphasis: { focus: 'series' },
      showSymbol: false,
      ...s.raw
    } as LineSeriesOption;
    return withArea
      ? { ...options, ...setAreaStyle(chartColors[i], colorBgContainerStyle.backgroundColor) }
      : options;
  });
};

function setAreaStyle(color: string, containerColor: string) {
  const areaStyle = {
    opacity: 0.4,
    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: color
      },
      {
        offset: 1,
        color: containerColor
      }
    ])
  };
  return { areaStyle };
}

function useVisualMap(alarm?: SeriesAlarm) {
  let visualMap;
  if (alarm && alarm.rules.length > 0 && isRulesValid(alarm.rules)) {
    const { seriesIndex, rules } = alarm;
    visualMap = {
      type: 'piecewise',
      show: false,
      dimension: 1,
      seriesIndex,
      pieces: getRanges(rules, chartColors[seriesIndex])
    };
  }
  return visualMap;
}

function isRulesValid(rules: SeriesAlarm['rules']) {
  const firstCondition = rules[0].condition;
  return rules
    .slice(1)
    .every(
      ({ condition }) =>
        condition.indexOf(firstCondition) > -1 || firstCondition.indexOf(condition) > -1
    );
}

function getRanges(rules: SeriesAlarm['rules'], color: string) {
  const condition = rules[0].condition;
  const values = rules.map(({ value }) => value);
  const start = -99999;
  const end = Infinity;
  const range = [start, ...values.concat(values).sort((n1, n2) => n1 - n2), end];
  const ranges = _.chunk(range, 2).map(([start, end], i) => ({ gt: start, lt: end }));
  return ranges.map((r, i) => {
    const gt = condition.indexOf('>') > -1;
    let level;
    if (gt && i !== 0) {
      level = rules.sort((r1, r2) => r1.value - r2.value)[i - 1].level;
    }
    return { ...r, color: level ? getColorByValue(level) : color };
  });
}
