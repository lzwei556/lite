import React from 'react';
import intl from 'react-intl-universal';
import {
  Chart,
  MutedCard,
  usePieOptions,
  PieOptionsProps,
  usePieOptionsLegacy
} from '../../components';
import { useLocaleContext } from '../../localeProvider';
import { Asset } from '..';
import { ENV } from '../../utils';

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
  const options = usePieOptions({ total, data, language, subtext });
  const optionsLegacy = usePieOptionsLegacy({ total, data, language, subtext });

  return (
    <MutedCard title={title} titleCenter={true}>
      <Chart
        options={ENV.legacyEnabled === 'true' ? optionsLegacy : options}
        style={{ height: chartHeight }}
      />
    </MutedCard>
  );
};
