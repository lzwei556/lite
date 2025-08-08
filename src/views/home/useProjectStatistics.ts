import * as React from 'react';
import { Language } from '../../localeProvider';
import { getBarPieOption, getOptions, getVerticalLegends } from '../../components';
import { getProjectStatistics, ProjectStatistics } from '../../asset-common';

export function useProjectStatistics() {
  const [projectStatistics, setProjectStatistics] = React.useState<ProjectStatistics | undefined>();
  React.useEffect(() => {
    getProjectStatistics().then(setProjectStatistics);
  }, []);
  return projectStatistics;
}

export const generatePieOptions = (
  total: number,
  data: { name: string; value: number; itemStyle: { color: string } }[],
  language: Language,
  subtext: string
) => {
  return getOptions(getBarPieOption(), {
    title: {
      text: `${total}`,
      subtext,
      left: 'center',
      top: 90,
      textStyle: {
        fontSize: 20,
        fontWeight: 400,
        color: 'rgba(0,0,0,.88)'
      }
    },
    legend: getVerticalLegends(data, language),
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
