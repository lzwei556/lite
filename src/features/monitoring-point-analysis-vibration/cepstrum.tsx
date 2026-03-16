import React from 'react';
import { Col } from 'antd';
import { Translation } from 'locales/utils';
import { CardChart, Grid, useLinedSeriesOptions } from 'components';
import { useWindow, Window } from './settings';
import { roundValue } from 'utils';
import { cepstrum } from 'monitoring-point/services';
import { AnalysisProps } from './useProps';

export const Cepstrum = ({ filters, intermediateData }: AnalysisProps) => {
  const { axis, property } = filters;
  const { originalDomain } = intermediateData;
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<{ x: number[]; y: number[] }>();
  const { x = [], y = [] } = data || {};
  const { window, setWindow } = useWindow();

  React.useEffect(() => {
    if (originalDomain) {
      const { frequency, fullScale, range, values } = originalDomain;
      setLoading(true);
      cepstrum({
        property: property.value,
        data: values,
        fs: frequency,
        full_scale: fullScale,
        range,
        window
      })
        .then(({ x, y }) => setData({ x: x.map((n) => roundValue(n * 1000)), y }))
        .finally(() => setLoading(false));
    } else {
      setData(undefined);
    }
  }, [originalDomain, property.value, window]);

  return (
    <Grid>
      <Col span={24}>
        <CardChart
          cardProps={{ extra: <Window onOk={setWindow} key='window' /> }}
          loading={loading}
          options={useLinedSeriesOptions({
            series: [
              {
                data: { [Translation.get(axis.label)]: y },
                xAxisValues: x.map((n) => `${n}`),
                raw: { animation: false }
              }
            ],
            config: {
              opts: {
                xAxis: {
                  name: 'ms',
                  axisLabel: {
                    formatter: (value: string) => `${Number(value).toFixed(0)}`,
                    interval: Math.floor(x.length / 20)
                  }
                },
                yAxis: { name: property.unit },
                dataZoom: [{ start: 0, end: 10 }],
                grid: { top: 60, bottom: 60, right: 40 },
                animation: false
              },
              switchs: { noArea: true }
            },
            yAxisMeta: { ...property, unit: property.unit }
          })}
          style={{ height: 450 }}
        />
      </Col>
    </Grid>
  );
};
