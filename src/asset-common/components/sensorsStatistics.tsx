import React from 'react';
import intl from 'react-intl-universal';
import { Chart, MutedCard, usePieOptions, usePieOptionsLegacy } from '../../components';
import { useLocaleContext } from '../../localeProvider';
import { ColorHealth, ColorOffline } from '../../constants/color';
import { ENV } from '../../utils';

export const SensorsStatistics = ({
  total,
  offlines,
  chartHeight = 210
}: {
  total?: number;
  offlines?: number;
  chartHeight?: number;
}) => {
  const { language } = useLocaleContext();
  const optionsObject = {
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
  };
  const options = usePieOptions(optionsObject);
  const optionsLegacy = usePieOptionsLegacy(optionsObject);

  return (
    <MutedCard title={intl.get('sensors')} titleCenter={true}>
      <Chart
        options={ENV.legacyEnabled === 'true' ? optionsLegacy : options}
        style={{ height: chartHeight }}
      />
    </MutedCard>
  );
};
