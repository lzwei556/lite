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
};

export function useYAxisOptions(meta?: YAxisMeta, opts?: ECOptions['yAxis']) {
  const { min, max, interval } = meta || {};
  const splited = split(max, min, interval);
  return {
    ...opts,
    type: 'value',
    min: splited?.[1],
    max: splited?.[0],
    interval: splited?.[2],
    axisLabel: {
      hideOverlap: true
    },
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    }
  } as YAXisComponentOption;
}

function split(max?: number, min?: number, initial?: number) {
  const SPLIT_NUMBER = 6;
  if (max === undefined || min === undefined || initial === undefined) return null;
  const precision = pickPrecisionFromInterval(initial);
  const newMax = getFitedValue(max, initial, precision, _.ceil);
  const newMin = getFitedValue(min, initial, precision, _.floor);
  const fitAllInterval = add(newMin, multiply(SPLIT_NUMBER, initial)) > newMax;
  let interval = initial;
  if (!fitAllInterval) {
    interval = _.ceil((newMax - newMin) / SPLIT_NUMBER, precision);
  }
  return [newMax, sub(newMax, multiply(SPLIT_NUMBER, interval)), interval];
}

function getFitedValue(
  n: number,
  interval: number,
  precision: number,
  fn: (n: number, p: number) => number
) {
  const m = fn(n, precision);
  return mod(m, interval) === 0 ? m : multiply(fn(n / interval, 0), interval);
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
