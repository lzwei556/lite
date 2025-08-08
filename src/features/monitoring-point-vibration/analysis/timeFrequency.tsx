import React from 'react';
import 'echarts-gl';
import { Space } from 'antd';
import intl from 'react-intl-universal';
import { CardChart, chartColors } from '../../../components';
import { timeFrequency } from '../../../asset-common';
import { AnalysisCommonProps } from './analysisContent';
import { useWindow, Window, useWindowLength, WindowLengthPopup } from './settings';

export const TimeFrequency = ({ property, originalDomain }: AnalysisCommonProps) => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<{ x: number[]; y: number[]; z: number[][] }>();
  const { x = [], y = [], z = [] } = data || {};
  const { window, setWindow } = useWindow();
  const { window_length, setWindowLength } = useWindowLength(originalDomain?.values?.length);
  const xAxisName = `${intl.get('FIELD_FREQUENCY')}（Hz）`;
  const yAxisName = `${intl.get('TIMESTAMP')}（s）`;
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
    <CardChart
      cardProps={{
        extra: (
          <Space size={4}>
            <Window onOk={setWindow} key='window' />
            <WindowLengthPopup
              maxLen={originalDomain?.values?.length}
              onOk={setWindowLength}
              key='window_length'
            />
          </Space>
        )
      }}
      loading={loading}
      options={{
        color: chartColors[0],
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
          name: xAxisName,
          nameTextStyle: { color: '#333' }
        },
        yAxis3D: {
          type: 'value',
          name: yAxisName,
          nameTextStyle: { color: '#333' }
        },
        zAxis3D: {
          type: 'value',
          name: zAxisName,
          nameTextStyle: { color: '#333' }
        },
        grid3D: {
          boxHeight: 80,
          boxDepth: 80,
          boxWidth: 200,
          viewControl: { alpha: 20, beta: 0 },
          axisLine: { lineStyle: { color: '#888', width: 1 } },
          splitLine: { show: true, lineStyle: { color: '#888' } },
          axisLabel: { textStyle: { color: '#333' } }
        },
        //@ts-ignore
        series: y.map((y, i) => ({
          type: 'line3D',
          data: x.map((n, j) => [n, y, z[j][i]]),
          name: y
        }))
      }}
      style={{ height: 400 }}
    />
  );
};
