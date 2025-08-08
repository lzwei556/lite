import React from 'react';
import intl from 'react-intl-universal';
import { ChartMark } from '../../../components';
import { timeEnvelope } from '../../../asset-common';
import { AnalysisCommonProps } from './analysisContent';
import { useWindow, Window, FilterTypeRelated, useFilterTypeRelated } from './settings';

export const TimeEnvelope = ({ property, originalDomain }: AnalysisCommonProps) => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<{ x: number[]; y: number[] }>();
  const { x = [], y = [] } = data || {};
  const { window, setWindow } = useWindow();
  const { filter_type_related, setFilter_type_related } = useFilterTypeRelated();
  React.useEffect(() => {
    if (originalDomain) {
      const { frequency, fullScale, range, values } = originalDomain;
      setLoading(true);
      timeEnvelope({
        property: property.value,
        data: values,
        fs: frequency,
        full_scale: fullScale,
        range,
        window,
        ...filter_type_related
      })
        .then(setData)
        .finally(() => setLoading(false));
    } else {
      setData(undefined);
    }
  }, [originalDomain, property.value, window, filter_type_related]);

  return (
    <ChartMark.Chart
      config={{
        opts: {
          xAxis: { axisLabel: { interval: Math.floor(x.length / 20) } },
          yAxis: { name: property.unit },
          dataZoom: [{ start: 0, end: 100 }],
          grid: { top: 30, bottom: 60, right: 30 }
        }
      }}
      loading={loading}
      series={[
        {
          data: { [intl.get('time.envelope')]: y },
          xAxisValues: x.map((n, i) => `${i}`)
        },
        {
          data: { [intl.get('signal')]: x },
          xAxisValues: x.map((n, i) => `${i}`)
        }
      ]}
      style={{ height: 450 }}
      toolbar={{
        visibles: ['save_image'],
        extra: [
          <Window onOk={setWindow} key='window' />,
          <FilterTypeRelated
            onOk={setFilter_type_related}
            initial={[
              filter_type_related.cutoff_range_low!,
              filter_type_related.cutoff_range_high!
            ]}
            key='filter_type'
          />
        ]
      }}
      yAxisMeta={{ ...property, unit: property.unit }}
    />
  );
};
