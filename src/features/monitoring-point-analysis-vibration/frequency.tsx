import React from 'react';
import { Col, Space, Typography } from 'antd';
import { Translation } from 'locales/utils';
import { ChartMark, Grid } from 'components';
import { frequency, FrequencyAnalysis } from 'asset-common';
import Sideband from './sideband';
import { Toolbar, useMarkChartProps, useDatazoom } from './mark';
import { useDownloadRawDataHandler } from './useDownladRawDataHandler';
import { useFaultFrequency } from './useFaultFrequency';
import { getValue, roundValue } from 'utils';
import { SidebarMarkList } from './sidebar-mark-list';
import { SettingsForm } from './mark/settings-form';
import { StatisticsTable } from './mark/statistics-table';
import { AnalysisProps } from './useProps';

export const Frequency = ({ monitoringPoint, filters, trend, intermediateData }: AnalysisProps) => {
  const { id, parent } = monitoringPoint;
  const { axis, property } = filters;
  const { timestamp } = trend;
  const { timeDomain, originalDomain } = intermediateData;
  const { range, frequency: timeDomainFrequency, number } = timeDomain?.data || {};
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<FrequencyAnalysis>();
  const { x = [], y = [] } = data || {};
  const {
    marks,
    handleClick,
    handleSidebandClick,
    isTypeSideband,
    handleRefreshHarmonic,
    handleRefreshSideband,
    handleToggleMarks,
    handleRestore,
    markType,
    dispatchMarks
  } = useMarkChartProps();
  const downlaodRawDataHandler = useDownloadRawDataHandler(
    id,
    timestamp,
    `${property.value}FrequencyDomain`
  );
  const rotation_speed = parent.attributes?.rpm;
  const dataZoom = useDatazoom();
  const { faultFrequencies } = useFaultFrequency(id, timestamp);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (property.value && originalDomain) {
      const { frequency: fs, fullScale, range, values } = originalDomain;
      setLoading(true);
      const data = {
        property: property.value,
        data: values,
        fs,
        full_scale: fullScale,
        range,
        window: 'hann'
      };
      frequency(rotation_speed ? { ...data, rpm: rotation_speed } : data)
        .then(({ x, y, ...rest }) => setData({ x: x.map((n) => roundValue(n)), y, ...rest }))
        .finally(() => {
          setLoading(false);
          dispatchMarks({ type: 'remove_by_type', removeTypes: ['Peak', 'Double', 'Multiple'] });
        });
    } else {
      setData(undefined);
    }
  }, [property.value, originalDomain, rotation_speed, dispatchMarks]);

  React.useEffect(() => {
    handleToggleMarks({ x, y, faultFrequencies, property });
  }, [handleToggleMarks, x, y, faultFrequencies, property]);

  React.useEffect(() => {
    handleRefreshHarmonic({ x, y, harmonic: data, property });
  }, [handleRefreshHarmonic, x, y, data, property]);

  React.useEffect(() => {
    handleRefreshSideband({ x, y, property });
  }, [handleRefreshSideband, x, y, property]);

  return (
    <Grid wrap={false}>
      <Col flex='auto'>
        <Grid>
          <Col span={24}>
            <ChartMark.Chart
              cardProps={{
                title: (
                  <Space>
                    {[
                      {
                        label: Translation.get('SETTING_RANGE'),
                        children: getValue({ value: range, unit: 'g' })
                      },
                      {
                        label: Translation.get('SETTING_SAMPLING_FREQUNECY'),
                        children: getValue({ value: timeDomainFrequency, unit: 'Hz' })
                      },
                      { label: Translation.get('SETTING_SAMPLING_NUMBER'), children: number }
                    ].map((item) => (
                      <span style={{ fontSize: 14, fontWeight: 400 }} key={item.label}>
                        <Typography.Text type='secondary'>{item.label}</Typography.Text>{' '}
                        {item.children}
                      </span>
                    ))}
                  </Space>
                )
              }}
              config={{
                opts: {
                  xAxis: {
                    name: 'Hz',
                    axisLabel: {
                      formatter: (value: string) => `${Number(value).toFixed(0)}`,
                      interval: Math.floor(x.length / 20)
                    }
                  },
                  yAxis: { name: property.unit, nameLocation: 'middle', nameGap: 40 },
                  dataZoom: dataZoom ?? [{ start: 0, end: 10 }],
                  grid: { top: 60, bottom: 60, left: 40, right: 30 },
                  animation: false
                }
              }}
              features={{
                download: {
                  onClick() {
                    downlaodRawDataHandler();
                  },
                  tooltipProps: { title: Translation.get('common.action.download') }
                },
                setup: {
                  onClick() {
                    setOpen(true);
                  },
                  tooltipProps: { title: Translation.get('common.settings') }
                },
                restore: {
                  onClick() {
                    handleRestore();
                    handleRefreshHarmonic({ x, y, harmonic: data, property });
                    handleRefreshSideband({ x, y, property });
                  }
                },
                saveAsImage: {}
              }}
              loading={loading}
              onEvents={{
                click: (coord: [string, number], xIndex?: number) => {
                  handleClick({ coord, x, y, xIndex, property, xUnit: 'Hz' });
                  handleSidebandClick({ coord, x, y, xIndex, property });
                }
              }}
              series={ChartMark.useMergeMarkDatas({
                series: [
                  {
                    data: { [Translation.get(axis.label)]: y ?? [] },
                    xAxisValues: x.map((n) => `${n}`),
                    raw: { animation: false }
                  }
                ],
                marks,
                lineStyle: { symbol: 'none' }
              })}
              style={{ height: 450 }}
              toolbars={[<Toolbar />]}
              yAxisMeta={{ ...property, unit: property.unit }}
            >
              {isTypeSideband && <Sideband.Switcher />}
              <SettingsForm
                open={open}
                onSuccess={() => {
                  setOpen(false);
                }}
                onCancel={() => setOpen(false)}
                type='frequency'
                base={data?.harmonic1XIndex && x[data.harmonic1XIndex]}
              />
            </ChartMark.Chart>
          </Col>
          <Col span={24}>
            <StatisticsTable {...{ x, y, faultFrequencies, property, harmonic: data }} />
          </Col>
        </Grid>
      </Col>
      <SidebarMarkList asset={parent} markType={markType} />
    </Grid>
  );
};
