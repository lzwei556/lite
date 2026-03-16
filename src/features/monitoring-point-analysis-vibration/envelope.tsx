import React from 'react';
import { Col, Space, Typography } from 'antd';
import { Translation } from 'locales/utils';
import { getValue, roundValue } from 'utils/format';
import { ChartMark, Grid } from 'components';
import { envelope, EnvelopeAnalysis } from 'asset-common';
import { useWindow, Window, FilterTypeRelated, useFilterTypeRelated } from './settings';
import Sideband from './sideband';
import { useMarkChartProps, Toolbar, useDatazoom } from './mark';
import { useFaultFrequency } from './useFaultFrequency';
import { SidebarMarkList } from './sidebar-mark-list';
import { SettingsForm } from './mark/settings-form';
import { StatisticsTable } from './mark/statistics-table';
import { AnalysisProps } from './useProps';

export const Envelope = ({ monitoringPoint, filters, trend, intermediateData }: AnalysisProps) => {
  const { id, parent } = monitoringPoint;
  const { axis, property } = filters;
  const { timestamp } = trend;
  const { timeDomain, originalDomain } = intermediateData;
  const { range, frequency: timeDomainFrequency, number } = timeDomain?.data || {};
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<EnvelopeAnalysis>();
  const { x = [], y = [] } = data || {};
  const { window, setWindow } = useWindow();
  const { filter_type_related, setFilter_type_related } = useFilterTypeRelated();
  const {
    marks,
    handleClick,
    isTypeSideband,
    handleRefreshHarmonic,
    handleToggleMarks,
    handleRestore,
    markType,
    dispatchMarks,
    handleRefreshSideband,
    handleSidebandClick
  } = useMarkChartProps();
  const rotation_speed = parent.attributes?.rpm;
  const dataZoom = useDatazoom();
  const { faultFrequencies } = useFaultFrequency(id, timestamp);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (originalDomain) {
      const { frequency, fullScale, range, values } = originalDomain;
      setLoading(true);
      const data = {
        property: property.value,
        data: values,
        fs: frequency,
        full_scale: fullScale,
        range,
        window,
        ...filter_type_related
      };
      envelope(rotation_speed ? { ...data, rpm: rotation_speed } : data)
        .then(({ x, y, ...rest }) => setData({ x: x.map((n) => roundValue(n)), y, ...rest }))
        .finally(() => {
          setLoading(false);
          dispatchMarks({ type: 'remove_by_type', removeTypes: ['Peak', 'Double', 'Multiple'] });
        });
    } else {
      setData(undefined);
    }
  }, [originalDomain, property.value, window, filter_type_related, rotation_speed, dispatchMarks]);

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
                extra: <Toolbar />,
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
                  dataZoom: dataZoom ?? [{ start: 0, end: getDataZoomMax(x, y), throttle: 500 }],
                  grid: { top: 60, bottom: 60, left: 40, right: 30 },
                  animation: false
                }
              }}
              features={{
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
                    data: { [Translation.get(axis.label)]: y },
                    xAxisValues: x.map((n) => `${n}`)
                  }
                ],
                marks,
                lineStyle: { symbol: 'none' }
              })}
              style={{ height: 450 }}
              toolbars={[
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
                </Space>,
                <Toolbar />
              ]}
              yAxisMeta={{ ...property, unit: property.unit }}
            >
              {isTypeSideband && <Sideband.Switcher />}
              <SettingsForm
                open={open}
                onSuccess={() => {
                  setOpen(false);
                }}
                onCancel={() => setOpen(false)}
                type='envelope'
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

const getDataZoomMax = (x: number[] = [], y: number[] = []) => {
  let maxinum = 100;
  if (x.length > 0 && y.length > 0) {
    const maxValue = Math.max(...y);
    const index = y.indexOf(maxValue);
    const validIndex = index * 4;
    if (validIndex <= x.length) {
      maxinum = Math.ceil((validIndex / x.length) * 100);
    }
  }
  return maxinum;
};
