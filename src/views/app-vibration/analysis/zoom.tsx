import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { ChartMark, Grid } from '../../../components';
import { roundValue } from '../../../utils/format';
import { zoom } from '../../asset-common';
import { AnalysisCommonProps } from './analysisContent';
import { useWindow, Window } from './settings';
import { useZoomRange, ZoomRange } from './settings/zoomRange';

export const Zoom = ({ axis, property, originalDomain }: AnalysisCommonProps) => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<{ x: string[]; y: number[] }>();
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
        .then(({ x, y }) => setData({ x: x.map((n) => `${roundValue(n)}`), y }))
        .finally(() => setLoading(false));
    } else {
      setData(undefined);
    }
  }, [originalDomain, property.value, window, zoomRange]);

  return (
    <Grid>
      <Col flex='auto'>
        <ChartMark.Chart
          cardProps={{
            style: { border: 'solid 1px #d3d3d3' }
          }}
          config={{
            opts: {
              xAxis: { name: 'Hz' },
              yAxis: { name: property.unit },
              dataZoom: [{ start: 0, end: 100 }],
              grid: { top: 30, bottom: 60, right: 30 }
            }
          }}
          loading={loading}
          series={[
            {
              data: { [intl.get(axis.label)]: y },
              xAxisValues: x
            }
          ]}
          style={{ height: 450 }}
          toolbar={{
            visibles: ['save_image'],
            extra: [
              <Window onOk={setWindow} key='window' />,
              <ZoomRange onOk={setZoomRange} key='zoomRange' />
            ]
          }}
          yAxisMeta={{ ...property, unit: property.unit }}
        />
      </Col>
    </Grid>
  );
};
