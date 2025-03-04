import * as React from 'react';
import intl from 'react-intl-universal';
import { generateColProps } from '../../utils/grid';
import { ColorHealth, ColorOffline } from '../../constants/color';
import { isMobile } from '../../utils/deviceDetection';
import { getBarPieOption, getOptions } from '../../components';
import { Asset, getProjectStatistics, MONITORING_POINT } from '../asset-common';

export function useProjectStatistics(rootAssetLabel: string) {
  const [statisticOfAsset, setStatisticOfAsset] = React.useState<any>();
  const [statisticOfMeasurement, setStatisticOfMeasurement] = React.useState<any>();
  const [statisticOfSensor, setStatisticOfSensor] = React.useState<any>();

  React.useEffect(() => {
    getProjectStatistics().then(
      ({
        rootAssetNum,
        rootAssetAlarmNum,
        deviceNum,
        deviceOfflineNum,
        monitoringPointNum,
        monitoringPointAlarmNum
      }) => {
        setStatisticOfAsset(
          generatePieOptions(
            intl.get('TOTAL_WITH_NUMBER', { number: rootAssetNum }),
            Asset.Statistics.resolveStatus(rootAssetNum, rootAssetAlarmNum).map((s) => ({
              ...s,
              name: intl.get(s.name),
              itemStyle: { color: s.color }
            }))
          )
        );
        setStatisticOfMeasurement(
          generatePieOptions(
            intl.get('TOTAL_WITH_NUMBER', { number: monitoringPointNum }),
            Asset.Statistics.resolveStatus(monitoringPointNum, monitoringPointAlarmNum).map(
              (s) => ({
                ...s,
                name: intl.get(s.name),
                itemStyle: { color: s.color }
              })
            )
          )
        );
        setStatisticOfSensor(
          generatePieOptions(intl.get('TOTAL_WITH_NUMBER', { number: deviceNum }), [
            {
              name: intl.get('ONLINE'),
              value: deviceNum - deviceOfflineNum,
              itemStyle: { color: ColorHealth }
            },
            {
              name: intl.get('OFFLINE'),
              value: deviceOfflineNum,
              itemStyle: { color: ColorOffline }
            }
          ])
        );
      }
    );
  }, []);

  const colProps = generateColProps({ lg: 8, xl: 8, xxl: 5 });

  return [
    { colProps, options: statisticOfAsset, title: intl.get(rootAssetLabel) },
    { colProps, options: statisticOfMeasurement, title: intl.get(MONITORING_POINT) },
    { colProps, options: statisticOfSensor, title: intl.get('SENSOR') }
  ];
}

const generatePieOptions = (
  title: string,
  data: { name: string; value: number; itemStyle: { color: string } }[]
) => {
  return getOptions(getBarPieOption(), {
    title: {
      text: title,
      left: 'center',
      top: 120
    },
    legend: {
      left: isMobile ? '25%' : '28%',
      formatter: (itemName: string) => {
        const series = data.find(({ name }) => itemName === name);
        return series ? `${itemName} {value|${series.value}}` : itemName;
      },
      width: '60%'
    },
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
