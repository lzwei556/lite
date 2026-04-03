import React from 'react';
import { Space } from 'antd';
import { LineOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { buildCustomTooltip, CardChart, LightSelectFilter, useLegendStyles } from 'components';
import { useWindow, Window } from './settings';
import { useCrossTarget } from './useCrossTarget';
import { useOriginalDomain } from './useOriginalDomain';
import { cross } from 'monitoring-point/services';
import { getValue } from 'utils';
import { AnalysisProps } from './useProps';
import { TMonitoringPoint, OMonitoringPoint } from 'domain/monitoring-point';

export const Cross = ({
  monitoringPoint: { id },
  trend: { timestamp },
  filters: { property },
  intermediateData: { originalDomain },
  currentFilters
}: AnalysisProps & { currentFilters: React.ReactNode }) => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<{ density: number[]; phase: number[]; x: number[] }>();
  const { density = [], phase = [], x = [] } = data || {};
  const { window, setWindow } = useWindow();
  const { points, setPoints } = useCrossTarget(id);
  const selectedPoint = points?.find((p) => p.selected);
  const selectedPointId = selectedPoint?.value;
  const targetAxis = OMonitoringPoint.Settings.Vibration.useAxisWithVibrationDirection(
    selectedPoint?.attributes as TMonitoringPoint.Settings.VibrationDirection
  );
  const targetOriginalDomain = useOriginalDomain(selectedPointId, timestamp, targetAxis.axis.value);

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

  const category = {
    density: { label: intl.get('cross.power.spectral.density'), unit: 'dB/Hz', precision: 3 },
    phase: { label: intl.get('cross.power.spectral.phase'), unit: 'xπ rad', precision: 0 }
  };

  return (
    <CardChart
      cardProps={{
        extra: <Window onOk={setWindow} key='window' />,
        title: (
          <Space split={<LineOutlined />}>
            {currentFilters}
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
                  options={targetAxis.options.map((a) => ({ ...a, label: intl.get(a.label) }))}
                  onChange={(value) => {
                    const axis = targetAxis.options.find((opt) => opt.value === value);
                    if (axis) {
                      targetAxis.setAxis(axis);
                    }
                  }}
                  value={targetAxis.axis.value}
                />
              )}
            </Space>
          </Space>
        )
      }}
      options={{
        axisPointer: {
          link: [
            {
              xAxisIndex: 'all'
            }
          ]
        },
        legend: useLegendStyles(),
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
            id: 'density',
            type: 'line',
            data: density,
            name: category.density.label + ` (${category.density.unit})`
          },
          {
            id: 'phase',
            type: 'line',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: phase,
            name: category.phase.label + ` (${category.phase.unit})`
          }
        ],
        tooltip: {
          trigger: 'axis',
          formatter: (data: any) => {
            if (Array.isArray(data) && data.length === 2) {
              const [first, second] = data;
              const firstCategory = category[first.seriesId as keyof typeof category];
              const firstTooltip = {
                marker: first.marker,
                name: first.seriesName.split('(')[0],
                text: getValue({ value: first.value, ...firstCategory })
              };
              const secondCategory = category[second.seriesId as keyof typeof category];
              const secondTooltip = {
                marker: second.marker,
                name: second.seriesName.split('(')[0],
                text: getValue({ value: second.value, ...secondCategory })
              };
              return buildCustomTooltip({
                title: getValue({ value: first.axisValue }),
                items: [firstTooltip, secondTooltip]
              });
            } else {
              return '';
            }
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
