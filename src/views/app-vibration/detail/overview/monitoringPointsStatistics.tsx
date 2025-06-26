import React from 'react';
import intl from 'react-intl-universal';
import { Card, Chart, getBarPieOption, getOptions } from '../../../../components';
import { Asset, AssetRow } from '../../../asset-common';

export const MonitoringPointsStatistics = (props: { asset: AssetRow }) => {
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
    ...getBarPieOption(),
    title: {
      text: `${statistics.monitoringPointNum}`,
      subtext: intl.get('total'),
      left: 'center',
      top: 95,
      textStyle: {
        fontSize: 30
      }
    },
    series: [
      {
        type: 'pie',
        name: '',
        radius: ['50%', '60%'],
        center: ['50%', '48%'],
        label: { show: false, formatter: '{b} {c}' },
        data: statisticsData
      }
    ]
  });

  return (
    <Card
      styles={{
        header: {
          border: 0,
          position: 'absolute',
          width: '100%',
          textAlign: 'center'
        },
        body: { height: '100%' }
      }}
      title={intl.get('monitoring.points.statistics')}
    >
      <Chart options={options} style={{ height: 265 }} />
    </Card>
  );
};
