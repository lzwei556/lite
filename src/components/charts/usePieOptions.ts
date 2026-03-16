import { LegendComponentOption } from 'echarts/types/dist/shared';
import { useGlobalStyles } from '../../styles';
import { getOptions, useBarPieOptions } from './utils';

export type PieOptionsProps = {
  total?: number;
  data?: { name: string; value: number; itemStyle: { color: string } }[];
  subtext: string;
};

export const usePieOptions = ({ total, data, subtext }: PieOptionsProps) => {
  const { colorTextStyle } = useGlobalStyles();
  const commonOptions = useBarPieOptions();
  const legend = useVerticalLegends(data ?? []);
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

export const usePieOptionsLegacy = ({ total, data, subtext }: PieOptionsProps) => {
  const { colorTextStyle } = useGlobalStyles();
  const commonOptions = useBarPieOptions();
  const legend = useVerticalLegends(data ?? []);
  if (!total || !data || data.length === 0) {
    return undefined;
  }
  return getOptions(commonOptions, {
    title: {
      text: `${total}`,
      subtext,
      left: 'center',
      top: 90,
      textStyle: {
        fontSize: 20,
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
        center: ['50%', '42%'],
        label: { show: false, formatter: '{b} {c}' },
        data
      }
    ],
    tooltip: {}
  });
};

const useVerticalLegends = (
  data: { name: string; value: number; itemStyle: { color: string } }[]
) => {
  const { colorTextDescriptionStyle } = useGlobalStyles();
  const barPieOpts = useBarPieOptions();
  const names = data.map((d) => d.name);
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
            rich: { name: { width: getItemWith(names) } }
          }
        };

        if (top2) {
          opts = { ...opts, left: getMargin(names) };
        } else {
          opts = { ...opts, right: getMargin(names) };
        }
        return opts;
      });
};

const getItemWith = (names: string[]) => {
  let width = 45;
  if (names.some((name) => name.length > 10)) {
    width = 80;
  }
  return width;
};

const getMargin = (names: string[]) => {
  let margin = '12%';
  if (names.some((name) => name.length > 10)) {
    margin = '3%';
  }
  return margin;
};
