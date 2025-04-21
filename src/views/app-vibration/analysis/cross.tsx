import React from 'react';
import { Space } from 'antd';
import intl from 'react-intl-universal';
import { CardChart, LightSelectFilter } from '../../../components';
import { roundValue } from '../../../utils/format';
import { cross } from '../../asset-common';
import { AnalysisCommonProps } from './analysisContent';
import { useWindow, Window } from './settings';
import { useCrossTarget } from './useCrossTarget';
import { useOriginalDomain } from './useOriginalDomain';
import { useAxis } from './useAxis';

export const Cross = ({ id, timestamp, property, originalDomain }: AnalysisCommonProps) => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<{ density: number[]; phase: number[]; x: number[] }>();
  const { density = [], phase = [], x = [] } = data || {};
  const { window, setWindow } = useWindow();
  const { points, setPoints } = useCrossTarget(id);
  const selectedPointId = points?.find((p) => p.selected)?.value;
  const targetAxis = useAxis();
  const targetOriginalDomain = useOriginalDomain(
    points?.[0].value,
    timestamp,
    targetAxis.axis.value
  );

  React.useEffect(() => {
    if (originalDomain && targetOriginalDomain) {
      const { frequency, fullScale, range, values } = originalDomain;
      setLoading(true);
      cross({
        data_x: values,
        data_y: targetOriginalDomain.values,
        fs: frequency,
        full_scale: fullScale,
        range,
        window
      })
        .then(setData)
        .finally(() => setLoading(false));
    } else {
      setData(undefined);
    }
  }, [originalDomain, property.value, window, targetOriginalDomain]);

  return (
    <CardChart
      cardProps={{
        extra: <Window onOk={setWindow} key='window' />,
        title: (
          <Space>
            <LightSelectFilter
              allowClear={false}
              options={points}
              onChange={(value) =>
                setPoints((prev) => prev?.map((p) => ({ ...p, selected: p.value === value })))
              }
              value={selectedPointId}
            />
            {selectedPointId && (
              <LightSelectFilter
                allowClear={false}
                options={targetAxis.axies.map((a) => ({ ...a, label: intl.get(a.label) }))}
                onChange={(value) =>
                  targetAxis.setAxies((prev) =>
                    prev.map((a) => ({ ...a, selected: a.value === value }))
                  )
                }
                value={targetAxis.axis.value}
              />
            )}
          </Space>
        ),
        style: { border: 'solid 1px #d3d3d3' }
      }}
      options={{
        axisPointer: {
          link: [
            {
              xAxisIndex: 'all'
            }
          ]
        },
        legend: {},
        grid: [
          {
            top: 60,
            bottom: 60,
            left: 60,
            right: 30,
            height: '35%'
          },
          {
            top: '65%',
            height: '35%',
            bottom: 60,
            left: 60,
            right: 30
          }
        ],
        series: [
          {
            type: 'line',
            data: density,
            name: intl.get('cross.power.spectral.density') + ' (dB/Hz)'
          },
          {
            type: 'line',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: phase,
            name: intl.get('cross.power.spectral.phase') + ' (xπ rad)'
          }
        ],
        tooltip: {
          trigger: 'axis',
          valueFormatter: (value) => {
            const suffix = property.unit;
            const roundedValue = roundValue(value as number);
            return suffix ? `${roundedValue} ${suffix}` : `${roundedValue}`;
          }
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: { onZero: true },
            axisLabel: {
              formatter: (value: number) => `${value ? Number(value).toFixed(0) : value}`,
              interval: Math.floor(x.length / 20)
            },
            data: x,
            name: 'Hz'
          },
          {
            gridIndex: 1,
            type: 'category',
            boundaryGap: false,
            axisLine: { onZero: true },
            axisLabel: {
              formatter: (value: number) => `${value ? Number(value).toFixed(0) : value}`,
              interval: Math.floor(x.length / 20)
            },
            data: x,
            position: 'top',
            name: 'Hz'
          }
        ],
        yAxis: [
          {
            type: 'value'
          },
          {
            gridIndex: 1,
            type: 'value',
            inverse: true,
            axisLabel: { formatter: (value: number) => `${Number(value).toFixed(2)}` }
          }
        ]
      }}
      loading={loading}
      style={{ height: 450 }}
    />
  );
};
