import * as React from 'react';
import { Language } from '../../localeProvider';
import { getOptions, useBarPieOption, useVerticalLegends } from '../../components';
import { getProjectStatistics, ProjectStatistics } from '../../asset-common';
import { useGlobalStyles } from '../../styles';

export function useProjectStatistics() {
  const [projectStatistics, setProjectStatistics] = React.useState<ProjectStatistics | undefined>();
  React.useEffect(() => {
    getProjectStatistics().then(setProjectStatistics);
  }, []);
  return projectStatistics;
}

export const usePieOptions = (
  total: number,
  data: { name: string; value: number; itemStyle: { color: string } }[],
  language: Language,
  subtext: string
) => {
  const { colorTextStyle } = useGlobalStyles();
  return getOptions(useBarPieOption(), {
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
    legend: useVerticalLegends(data, language),
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
