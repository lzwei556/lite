import React from 'react';
import intl from 'react-intl-universal';
import { Chart, MutedCard, usePieOptions } from '../../components';
import { useLocaleContext } from '../../localeProvider';
import { ColorHealth, ColorOffline } from '../../constants/color';

export const SensorsStatistics = ({
  total,
  offlines,
  chartHeight = 280
}: {
  total?: number;
  offlines?: number;
  chartHeight?: number;
}) => {
  const { language } = useLocaleContext();

  return (
    <MutedCard title={intl.get('sensors')} titleCenter={true}>
      <Chart
        options={usePieOptions({
          total,
          data:
            total != null && offlines != null
              ? [
                  {
                    name: intl.get('ONLINE'),
                    value: total - offlines,
                    itemStyle: { color: ColorHealth }
                  },
                  {
                    name: intl.get('OFFLINE'),
                    value: offlines,
                    itemStyle: { color: ColorOffline }
                  }
                ]
              : [],
          language,
          subtext: intl.get('total')
        })}
        style={{ height: chartHeight }}
      />
    </MutedCard>
  );
};
