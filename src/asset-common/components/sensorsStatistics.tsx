import React from 'react';
import { Chart, MutedCard, usePieOptions, usePieOptionsLegacy } from '../../components';
import { ColorHealth, ColorOffline } from '../../constants/color';
import { ENV } from '../../utils';
import { Translation } from 'locales/utils';

export const SensorsStatistics = ({
  total,
  offlines,
  chartHeight = 210
}: {
  total?: number;
  offlines?: number;
  chartHeight?: number;
}) => {
  const optionsObject = {
    total,
    data:
      total != null && offlines != null
        ? [
            {
              name: Translation.get('device.status.online'),
              value: total - offlines,
              itemStyle: { color: ColorHealth }
            },
            {
              name: Translation.get('device.status.offline'),
              value: offlines,
              itemStyle: { color: ColorOffline }
            }
          ]
        : [],
    subtext: Translation.get('common.total')
  };
  const options = usePieOptions(optionsObject);
  const optionsLegacy = usePieOptionsLegacy(optionsObject);

  return (
    <MutedCard title={Translation.get('device.sensors')} titleCenter={true}>
      <Chart
        options={ENV.legacyEnabled === 'true' ? optionsLegacy : options}
        style={{ height: chartHeight }}
      />
    </MutedCard>
  );
};
