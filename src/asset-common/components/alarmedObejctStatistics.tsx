import React from 'react';
import {
  Chart,
  MutedCard,
  usePieOptions,
  PieOptionsProps,
  usePieOptionsLegacy
} from '../../components';
import { Asset } from '..';
import { ENV } from '../../utils';
import { Translation } from 'locales/utils';

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
  let data: PieOptionsProps['data'] = [];
  if (total) {
    data = Asset.Statistics.resolveStatus(total, alarms).map((s) => ({
      ...s,
      name: Translation.get(s.name),
      itemStyle: { color: s.color }
    }));
  }
  const options = usePieOptions({ total, data, subtext });
  const optionsLegacy = usePieOptionsLegacy({ total, data, subtext });

  return (
    <MutedCard title={title} titleCenter={true}>
      <Chart
        options={ENV.legacyEnabled === 'true' ? optionsLegacy : options}
        style={{ height: chartHeight }}
      />
    </MutedCard>
  );
};
