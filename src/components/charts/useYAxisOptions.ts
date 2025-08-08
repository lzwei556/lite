import _ from 'lodash';
import * as Mathjs from 'mathjs';
import type { YAXisComponentOption } from 'echarts';
import type { ECOptions } from './chart';

export type YAxisMeta = {
  max?: number;
  min?: number;
  precision?: number;
  interval?: number;
  unit?: string;
  startValue?: number;
};

export function useYAxisOptions(meta?: YAxisMeta, opts?: ECOptions['yAxis']) {
  const { min, max, interval, startValue } = meta || {};
  const splited = split({ max, min, interval, startValue });
  const options = {
    ...opts,
    type: 'value',
    axisLabel: {
      hideOverlap: true
    },
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    }
  } as YAXisComponentOption;
  return splited ? { ...options, ...splited } : { ...options, boundaryGap: ['20%', '20%'] };
}

function split(initial: { max?: number; min?: number; interval?: number; startValue?: number }) {
  const SPLIT_NUMBER = 6;
  if (initial.max === undefined || initial.min === undefined || initial.interval === undefined)
    return null;
  const precision = pickPrecisionFromInterval(initial.interval);
  const dataMax = getFitedValue({
    value: initial.max + initial.interval,
    interval: initial.interval,
    precision,
    formatFn: _.ceil
  });
  const datadMin = getFitedValue({
    value: initial.min,
    interval: initial.interval,
    precision,
    formatFn: _.floor
  });
  const interval = calculateInterval({
    splitNumber: SPLIT_NUMBER,
    initial: initial.interval,
    min: datadMin,
    max: dataMax,
    precision
  });
  const min = initial.startValue ?? sub(dataMax, multiply(SPLIT_NUMBER, interval));
  const max = Math.max(add(min, multiply(SPLIT_NUMBER, interval)), dataMax);
  return { max, min, interval };
}

function calculateInterval({
  splitNumber,
  initial,
  min,
  max,
  precision
}: {
  splitNumber: number;
  initial: number;
  min: number;
  max: number;
  precision: number;
}) {
  const fitAllInterval = add(min, multiply(splitNumber, initial)) > max;
  let interval = initial;
  if (!fitAllInterval) {
    interval = _.ceil((max - min) / splitNumber, precision);
  }
  return interval;
}

function getFitedValue({
  value,
  interval,
  precision,
  formatFn
}: {
  value: number;
  interval: number;
  precision: number;
  formatFn: (n: number, p: number) => number;
}) {
  const m = formatFn(value, precision);
  return mod(m, interval) === 0 ? m : multiply(formatFn(value / interval, 0), interval);
}

function pickPrecisionFromInterval(interval: number) {
  const pos = interval.toString().indexOf('.') + 1;
  return pos === 0 ? 0 : interval.toString().length - pos;
}

function add(x: number, y: number) {
  return Number(Mathjs.format(Mathjs.add(Mathjs.bignumber(x), Mathjs.bignumber(y))));
}
function multiply(x: number, y: number) {
  return Number(Mathjs.format(Mathjs.multiply(Mathjs.bignumber(x), Mathjs.bignumber(y))));
}
function mod(x: number, y: number) {
  return Number(Mathjs.format(Mathjs.mod(Mathjs.bignumber(x), Mathjs.bignumber(y))));
}
function sub(x: number, y: number) {
  return Number(Mathjs.format(Mathjs.subtract(Mathjs.bignumber(x), Mathjs.bignumber(y))));
}
