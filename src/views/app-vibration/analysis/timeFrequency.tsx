import React from 'react';
import { Col } from 'antd';
import 'echarts-gl';
import intl from 'react-intl-universal';
import { CardChart, Grid } from '../../../components';
import { timeFrequency } from '../../asset-common';
import { AnalysisCommonProps } from './analysisContent';
import { useWindow, Window } from './settings';
import { useWindowLength, WindowLength } from './settings/windowLength';

export const TimeFrequency = ({ property, originalDomain }: AnalysisCommonProps) => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<{ x: number[]; y: number[]; z: number[][] }>();
  const { x = [], y = [], z = [] } = data || {};
  const { window, setWindow } = useWindow();
  const { window_length, setWindowLength } = useWindowLength();
  const xAxisName = `${intl.get('FIELD_FREQUENCY')}（Hz）`;
  const yAxisName = `${intl.get('TIMESTAMP')}（Hz）`;
  const zAxisName = intl.get('amplitude');

  React.useEffect(() => {
    if (originalDomain) {
      const { frequency, fullScale, range, values } = originalDomain;
      setLoading(true);
      timeFrequency({
        property: property.value,
        data: values,
        fs: frequency,
        full_scale: fullScale,
        range,
        window,
        window_length
      })
        .then(setData)
        .finally(() => setLoading(false));
    } else {
      setData(undefined);
    }
  }, [originalDomain, property.value, window, window_length]);

  return (
    <Grid>
      <Col flex='auto'>
        <CardChart
          cardProps={{
            extra: [
              <Window onOk={setWindow} key='window' />,
              <WindowLength onOk={setWindowLength} key='window_length' />
            ],
            style: { border: 'solid 1px #d3d3d3' }
          }}
          loading={loading}
          options={{
            tooltip: {
              trigger: 'item',
              formatter: (paras: any) => {
                let x, y, z;
                const value = paras.value;
                if (value && Array.isArray(value) && value.length === 3) {
                  x = value[0];
                  y = value[1];
                  z = value[2];
                }
                let text = `${paras.marker} ${paras.seriesName}`;
                if (x) {
                  text += `<br/>${xAxisName}${x}`;
                }
                if (y) {
                  text += `<br/>${yAxisName}${y}`;
                }
                if (z) {
                  text += `<br/>${zAxisName} ${z}`;
                }
                return text;
              }
            },
            xAxis3D: {
              type: 'value',
              name: xAxisName
            },
            yAxis3D: {
              type: 'value',
              name: yAxisName
            },
            zAxis3D: {
              type: 'value',
              name: zAxisName
            },
            grid3D: {},
            //@ts-ignore
            series: y.map((y, i) => ({
              type: 'line3D',
              data: x.map((n, j) => [n, y, z[j][i]]),
              name: y
            })),
            grid: { top: 30, bottom: 60, right: 30 }
          }}
          style={{ height: 450 }}
        />
      </Col>
    </Grid>
  );
};
