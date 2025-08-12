import _ from 'lodash';
import { LegendComponentOption } from 'echarts/types/dist/shared';
import { Language } from '../../localeProvider';
import { useGlobalStyles } from '../../styles';
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

export function useBarPieOption() {
  const { colorTextDescriptionStyle } = useGlobalStyles();
  return {
    title: {
      textStyle: { ...colorTextDescriptionStyle, fontWeight: 400, fontSize: 16 }
    },
    grid: { top: 48, bottom: 40 },
    legend: {
      bottom: 8,
      itemWidth: 15,
      itemHeight: 14,
      itemGap: 5,
      textStyle: {
        ...colorTextDescriptionStyle
      }
    }
  };
}

export const useVerticalLegends = (
  data: { name: string; value: number; itemStyle: { color: string } }[],
  language: Language
) => {
  const { colorTextDescriptionStyle } = useGlobalStyles();
  const barPieOpts = useBarPieOption();
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
          ...barPieOpts.legend,
          data: [name],
          orient: 'vertical',
          bottom: even ? 20 : 'bottom',
          formatter: `{name|{name}} ${value}`,
          textStyle: {
            ...colorTextDescriptionStyle,
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
