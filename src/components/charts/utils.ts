import _ from 'lodash';
import { LegendComponentOption } from 'echarts/types/dist/shared';
import { Language } from '../../localeProvider';
import type { ECOptions } from './chart';

export const chartColors = [
  '#0084FC',
  '#FDD845',
  '#22ED7C',
  '#5470c6',
  '#91cc75',
  '#fac858',
  '#ee6666',
  '#73c0de',
  '#3ba272'
];

export function getOptions(...opts: ECOptions[]) {
  const color = chartColors;
  const grid = {
    top: '12%',
    bottom: '10%',
    right: 16,
    left: 16,
    containLabel: true
  };
  const toolbox = {
    feature: {
      brush: { icon: { rect: '', polygon: '', lineX: '', lineY: '', keep: '', clear: '' } }
    }
  };
  return _.merge({ grid, color, toolbox }, ...opts);
}

export function getBarPieOption() {
  return {
    title: {
      textStyle: { color: 'rgba(0,0,0,0.45)', fontWeight: 400, fontSize: 16 }
    },
    grid: { top: 48, bottom: 40 },
    legend: {
      bottom: 8,
      itemWidth: 15,
      itemHeight: 14,
      itemGap: 5,
      textStyle: {
        color: 'rgba(0,0,0,0.45)',
        rich: {
          value: {
            display: 'inline-block',
            backgroundColor: '#fff',
            width: 30
          }
        }
      }
    }
  };
}

export const getVerticalLegends = (
  data: { name: string; value: number; itemStyle: { color: string } }[],
  language: Language
) => {
  return data.length === 2
    ? {
        formatter: (itemName: string) => {
          const series = data.find(({ name }) => itemName === name);
          return series ? `${itemName} ${series.value}` : itemName;
        }
      }
    : data.map(({ name, value }, i) => {
        const even = i % 2 === 0;
        const top2 = i < 2;
        let opts: LegendComponentOption = {
          ...getBarPieOption().legend,
          data: [name],
          orient: 'vertical',
          bottom: even ? 20 : 'bottom',
          formatter: `{name|{name}} ${value}`,
          textStyle: {
            color: 'rgba(0,0,0,0.45)',
            rich: { name: { width: language === 'en-US' ? 45 : 25 } }
          }
        };
        if (top2) {
          opts = { ...opts, left: '16%' };
        } else {
          opts = { ...opts, right: '16%' };
        }
        return opts;
      });
};
