import React from 'react';
import 'echarts-gl';
import { Space } from 'antd';
import intl from 'react-intl-universal';
import { buildCustomTooltip, CardChart, chartColors, TooltipItem } from '../../../components';
import { timeFrequency } from '../../../asset-common';
import { useGlobalStyles } from '../../../styles';
import { AnalysisCommonProps } from './analysisContent';
import { useWindow, Window, useWindowLength, WindowLengthPopup } from './settings';
import { getValue } from '../../../utils';

export const TimeFrequency = ({ property, originalDomain }: AnalysisCommonProps) => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<{ x: number[]; y: number[]; z: number[][] }>();
  const { x = [], y = [], z = [] } = data || {};
  const { window, setWindow } = useWindow();
  const { window_length, setWindowLength } = useWindowLength(originalDomain?.values?.length);
  const xAxisName = `${intl.get('FIELD_FREQUENCY')}（Hz）`;
  const yAxisName = `${intl.get('TIMESTAMP')}（s）`;
  const zAxisName = intl.get('amplitude');
  const { colorTextSecondaryStyle, colorTextDescriptionStyle } = useGlobalStyles();

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
            const items: TooltipItem[] = [];
            if (x) {
              items.push({ marker: '', name: xAxisName, text: getValue({ value: x }) });
            }
            if (y) {
              items.push({ marker: '', name: yAxisName, text: getValue({ value: y }) });
            }
            if (z) {
              items.push({ marker: '', name: zAxisName, text: getValue({ value: z }) });
            }
            return buildCustomTooltip({ title: `${paras.marker} ${paras.seriesName}`, items });
          }
        },
        xAxis3D: {
          type: 'value',
          name: xAxisName,
          nameTextStyle: colorTextSecondaryStyle
        },
        yAxis3D: {
          type: 'value',
          name: yAxisName,
          nameGap: 30,
          nameTextStyle: colorTextSecondaryStyle
        },
        zAxis3D: {
          type: 'value',
          name: zAxisName,
          nameGap: 35,
          nameTextStyle: colorTextSecondaryStyle
        },
        grid3D: {
          boxHeight: 80,
          boxDepth: 80,
          boxWidth: 200,
          viewControl: { alpha: 20, beta: 0 },
          axisLine: { lineStyle: { ...colorTextDescriptionStyle, width: 1 } },
          splitLine: { show: true, lineStyle: colorTextDescriptionStyle },
          axisLabel: { textStyle: colorTextSecondaryStyle }
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
