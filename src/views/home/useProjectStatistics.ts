import * as React from 'react';
import { LegendComponentOption } from 'echarts/types/dist/shared';
import { Language } from '../../localeProvider';
import { getBarPieOption, getOptions } from '../../components';
import { getProjectStatistics, ProjectStatistics } from '../asset-common';

export function useProjectStatistics() {
  const [projectStatistics, setProjectStatistics] = React.useState<ProjectStatistics | undefined>();
  React.useEffect(() => {
    getProjectStatistics().then(setProjectStatistics);
  }, []);
  return projectStatistics;
}

export const generatePieOptions = (
  title: string,
  data: { name: string; value: number; itemStyle: { color: string } }[],
  language: Language
) => {
  return getOptions(getBarPieOption(), {
    title: {
      text: title,
      left: 'center',
      top: 120
    },
    legend:
      data.length === 2
        ? {
            formatter: (itemName) => {
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
          }),
    series: [
      {
        type: 'pie',
        name: '',
        radius: ['45%', '55%'],
        center: ['50%', '45%'],
        label: { show: false, formatter: '{b} {c}' },
        data
      }
    ],
    tooltip: {}
  });
};
