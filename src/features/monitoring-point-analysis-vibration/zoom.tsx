import React from 'react';
import { Col, Space } from 'antd';
import intl from 'react-intl-universal';
import { AnalysisCommonProps } from './analysisContent';
import { useWindow, Window, useZoomRange, ZoomRange } from './settings';
import { roundValue } from 'utils';
import { CardChart, Grid, useLinedSeriesOptions } from 'components';
import { zoom } from 'monitoring-point/services';

export const Zoom = ({ axis, property, originalDomain }: AnalysisCommonProps) => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<{ x: number[]; y: number[] }>();
  const { x = [], y = [] } = data || {};
  const { window, setWindow } = useWindow();
  const { zoomRange, setZoomRange } = useZoomRange();

  React.useEffect(() => {
    if (originalDomain) {
      const { frequency, fullScale, range, values } = originalDomain;
      setLoading(true);
      zoom({
        property: property.value,
        data: values,
        fs: frequency,
        full_scale: fullScale,
        range,
        window,
        ...zoomRange,
        scale: 8 // hard code
      })
        .then(({ x, y }) => setData({ x: x.map((n) => roundValue(n)), y }))
        .finally(() => setLoading(false));
    } else {
      setData(undefined);
    }
  }, [originalDomain, property.value, window, zoomRange]);

  return (
    <Grid>
      <Col span={24}>
        <CardChart
          cardProps={{
            extra: (
              <Space size={4}>
                <Window onOk={setWindow} key='window' />
                <ZoomRange onOk={setZoomRange} key='zoomRange' />
              </Space>
            )
          }}
          loading={loading}
          options={useLinedSeriesOptions({
            config: {
              opts: {
                xAxis: {
                  name: 'Hz',
                  axisLabel: {
                    formatter: (value: string) => `${Number(value).toFixed(0)}`,
                    interval: Math.floor(x.length / 20)
                  }
                },
                yAxis: { name: property.unit },
                dataZoom: [{ start: 0, end: 100 }],
                grid: { top: 60, bottom: 60, right: 30 }
              },
              switchs: { noArea: true }
            },
            series: [
              {
                data: { [intl.get(axis.label)]: y },
                xAxisValues: x.map((n) => `${n}`)
              }
            ],
            yAxisMeta: { ...property, unit: property.unit }
          })}
          style={{ height: 450 }}
        />
      </Col>
    </Grid>
  );
};
