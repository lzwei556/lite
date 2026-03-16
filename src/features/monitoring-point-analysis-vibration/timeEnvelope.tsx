import React from 'react';
import { Translation } from 'locales/utils';
import { timeEnvelope } from 'asset-common';
import { useWindow, Window, FilterTypeRelated, useFilterTypeRelated } from './settings';
import { CardChart, useLinedSeriesOptions } from 'components';
import { Space } from 'antd';
import { AnalysisProps } from './useProps';

export const TimeEnvelope = ({ filters, intermediateData }: AnalysisProps) => {
  const { property } = filters;
  const { originalDomain } = intermediateData;
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
    <CardChart
      cardProps={{
        extra: (
          <Space size={4}>
            <Window onOk={setWindow} key='window' />
            <FilterTypeRelated
              onOk={setFilter_type_related}
              initial={[
                filter_type_related.cutoff_range_low!,
                filter_type_related.cutoff_range_high!
              ]}
              key='filter_type'
            />
          </Space>
        )
      }}
      loading={loading}
      options={useLinedSeriesOptions({
        config: {
          opts: {
            xAxis: { axisLabel: { interval: Math.floor(x.length / 20) } },
            yAxis: { name: property.unit },
            dataZoom: [{ start: 0, end: 10 }],
            grid: { top: 30, bottom: 60, right: 30 },
            animation: false
          },
          switchs: { noArea: true }
        },
        series: [
          {
            data: { [Translation.get('vibration.analysis.time-envelope')]: y },
            xAxisValues: x.map((n, i) => `${i}`)
          },
          {
            data: { [Translation.get('vibration.analysis.signal')]: x },
            xAxisValues: x.map((n, i) => `${i}`)
          }
        ],
        yAxisMeta: { ...property, unit: property.unit }
      })}
      style={{ height: 450 }}
    />
  );
};
