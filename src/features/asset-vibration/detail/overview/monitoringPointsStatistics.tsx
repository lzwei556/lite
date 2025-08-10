import React from 'react';
import intl from 'react-intl-universal';
import {
  Chart,
  getOptions,
  MutedCard,
  useBarPieOption,
  useVerticalLegends
} from '../../../../components';
import { useLocaleContext } from '../../../../localeProvider';
import { Asset, AssetRow } from '../../../../asset-common';
import { useGlobalStyles } from '../../../../styles';

export const MonitoringPointsStatistics = (props: { asset: AssetRow }) => {
  const { language } = useLocaleContext();
  const { colorTextStyle } = useGlobalStyles();
  const { asset } = props;
  const { statistics } = asset;
  const statisticsData = Asset.Statistics.resolveStatus(
    statistics.monitoringPointNum,
    statistics.alarmNum
  ).map((s) => ({
    ...s,
    name: intl.get(s.name),
    itemStyle: { color: s.color }
  }));
  const options = getOptions({
    ...useBarPieOption(),
    title: {
      text: `${statistics.monitoringPointNum}`,
      subtext: intl.get('monitoring.point.total'),
      left: 'center',
      top: 90,
      textStyle: {
        fontSize: 20,
        fontWeight: 400,
        ...colorTextStyle
      }
    },
    legend: useVerticalLegends(statisticsData, language),
    series: [
      {
        type: 'pie',
        name: '',
        radius: ['50%', '60%'],
        center: ['50%', '42%'],
        label: { show: false, formatter: '{b} {c}' },
        data: statisticsData
      }
    ]
  });

  return (
    <MutedCard title={intl.get('monitoring.points.statistics')} titleCenter={true}>
      <Chart options={options} style={{ height: 280 }} />
    </MutedCard>
  );
};
