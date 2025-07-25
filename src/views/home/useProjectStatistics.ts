import * as React from 'react';
import { Language } from '../../localeProvider';
import { getBarPieOption, getOptions, getVerticalLegends } from '../../components';
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
    legend: getVerticalLegends(data, language),
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
