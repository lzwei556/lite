import React from 'react';
import intl from 'react-intl-universal';
import { Chart, MutedCard, usePieOptions, PieOptionsProps } from '../../components';
import { useLocaleContext } from '../../localeProvider';
import { Asset } from '..';

export const AlarmsObjectStatistics = ({
  total,
  alarms = [0, 0, 0],
  title,
  subtext,
  chartHeight = 210
}: {
  total?: number;
  alarms?: [number, number, number];
  title: string;
  subtext: string;
  chartHeight?: number;
}) => {
  const { language } = useLocaleContext();
  let data: PieOptionsProps['data'] = [];
  if (total) {
    data = Asset.Statistics.resolveStatus(total, alarms).map((s) => ({
      ...s,
      name: intl.get(s.name),
      itemStyle: { color: s.color }
    }));
  }

  return (
    <MutedCard title={title} titleCenter={true}>
      <Chart
        options={usePieOptions({ total, data, language, subtext })}
        style={{ height: chartHeight }}
      />
    </MutedCard>
  );
};
