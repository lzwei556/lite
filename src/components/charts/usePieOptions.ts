import { LegendComponentOption } from 'echarts/types/dist/shared';
import { Language } from '../../localeProvider';
import { useGlobalStyles } from '../../styles';
import { getOptions, useBarPieOptions } from './utils';

export type PieOptionsProps = {
  total?: number;
  data?: { name: string; value: number; itemStyle: { color: string } }[];
  language: Language;
  subtext: string;
};

export const usePieOptions = ({ total, data, language, subtext }: PieOptionsProps) => {
  const { colorTextStyle } = useGlobalStyles();
  const commonOptions = useBarPieOptions();
  const legend = useVerticalLegends(data ?? [], language);
  if (!total || !data || data.length === 0) {
    return undefined;
  }
  return getOptions(commonOptions, {
    title: {
      text: `${total}`,
      subtext,
      left: 'center',
      top: 60,
      textStyle: {
        fontSize: 18,
        fontWeight: 400,
        ...colorTextStyle
      }
    },
    legend,
    series: [
      {
        type: 'pie',
        name: '',
        radius: ['50%', '60%'],
        center: ['50%', '37%'],
        label: { show: false, formatter: '{b} {c}' },
        data
      }
    ],
    tooltip: {}
  });
};

const useVerticalLegends = (
  data: { name: string; value: number; itemStyle: { color: string } }[],
  language: Language
) => {
  const { colorTextDescriptionStyle } = useGlobalStyles();
  const barPieOpts = useBarPieOptions();
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
