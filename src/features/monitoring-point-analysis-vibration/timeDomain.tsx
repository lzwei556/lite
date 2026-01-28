import React from 'react';
import { Col, Space, Typography } from 'antd';
import intl from 'react-intl-universal';
import { ChartMark, Grid } from 'components';
import { getValue } from 'utils';
import { AnalysisCommonProps } from './analysisContent';
import { MarkType, Toolbar, useDatazoom, useMarkChartProps } from './mark';
import { useDownloadRawDataHandler } from './useDownladRawDataHandler';
import { SidebarMarkList } from './sidebar-mark-list';

export const TimeDomain = ({
  axis,
  property,
  timeDomain,
  id,
  timestamp,
  parent
}: AnalysisCommonProps) => {
  const { loading, data } = timeDomain || {};
  const { x = [], y = [], range, frequency, number, xAxisUnit } = data || {};
  const { marks, handleClick, handleRestore, markType, dispatchMarks } = useMarkChartProps();
  const downlaodRawDataHandler = useDownloadRawDataHandler(
    id,
    timestamp,
    `${property.value}TimeDomain`
  );
  const hiddens: MarkType[] = ['Harmonic', 'Sideband', 'Faultfrequency', 'Top10'];
  const dataZoom = useDatazoom();

  React.useEffect(() => {
    dispatchMarks({ type: 'remove_by_type', removeTypes: ['Peak', 'Double', 'Multiple'] });
  }, [dispatchMarks, data]);

  return (
    <Grid wrap={false}>
      <Col flex='auto'>
        <ChartMark.Chart
          cardProps={{
            title: (
              <Space>
                {[
                  {
                    label: intl.get('SETTING_RANGE'),
                    children: getValue({ value: range, unit: 'g' })
                  },
                  {
                    label: intl.get('SETTING_SAMPLING_FREQUNECY'),
                    children: getValue({ value: frequency, unit: 'Hz' })
                  },
                  { label: intl.get('SETTING_SAMPLING_NUMBER'), children: number }
                ].map((item) => (
                  <span style={{ fontSize: 14, fontWeight: 400 }} key={item.label}>
                    <Typography.Text type='secondary'>{item.label}</Typography.Text> {item.children}
                  </span>
                ))}
              </Space>
            )
          }}
          config={{
            opts: {
              xAxis: {
                name: xAxisUnit,
                axisLabel: {
                  formatter: (value: string) => `${Number(value).toFixed(0)}`,
                  interval: Math.floor(x.length / 20)
                }
              },
              yAxis: { name: property.unit },
              dataZoom: dataZoom ?? [{ start: 0, end: 10 }],
              grid: { top: 60, bottom: 60, right: 40 },
              animation: false
            }
          }}
          features={{
            download: {
              onClick() {
                downlaodRawDataHandler();
              },
              tooltipProps: { title: intl.get('DOWNLOAD_DATA') }
            },
            restore: {
              onClick() {
                handleRestore();
              }
            },
            saveAsImage: {}
          }}
          loading={loading}
          onEvents={{
            click: (coord: [string, number], xIndex?: number) => {
              handleClick({ coord, x, y, xIndex, property, xUnit: xAxisUnit });
            }
          }}
          series={ChartMark.useMergeMarkDatas({
            series: [
              {
                data: { [intl.get(axis.label)]: y },
                xAxisValues: x.map((n) => `${n}`),
                raw: { animation: false }
              }
            ],
            marks,
            lineStyle: { symbol: 'none' }
          })}
          style={{ height: 450 }}
          toolbars={[<Toolbar hiddens={hiddens} />]}
          yAxisMeta={{ ...property, unit: property.unit }}
        />
      </Col>
      <SidebarMarkList asset={parent} markType={markType} markTypes={hiddens} />
    </Grid>
  );
};
