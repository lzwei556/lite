import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { ChartMark, Card, Descriptions, Grid } from '../../../components';
import { AnalysisSidebarCollapse } from '../../../features';
import { AnalysisCommonProps } from './analysisContent';
import { MarkList, SingleDoubleToggle, useMarkChartProps } from './mark';
import { useDownloadRawDataHandler } from './useDownladRawDataHandler';

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
  const { marks, handleClick, handleRefresh } = useMarkChartProps();
  const downlaodRawDataHandler = useDownloadRawDataHandler(
    id,
    timestamp,
    `${property.value}TimeDomain`
  );
  const rotation_speed = parent.attributes?.rotation_speed;

  React.useEffect(() => {
    handleRefresh(x, y);
  }, [handleRefresh, x, y]);

  return (
    <Grid>
      <Col flex='auto'>
        <ChartMark.Chart
          cardProps={{
            extra: <SingleDoubleToggle />,
            style: { border: 'solid 1px #d3d3d3' }
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
              dataZoom: [{ start: 0, end: 100 }],
              grid: { top: 60, bottom: 60, right: 40 }
            }
          }}
          loading={loading}
          onEvents={{
            click: (coord: [string, number], xIndex?: number) => {
              handleClick(coord, x, y, xIndex);
            }
          }}
          series={ChartMark.mergeMarkDatas({
            series: [
              {
                data: { [intl.get(axis.label)]: y },
                xAxisValues: x.map((n) => `${n}`),
                raw: { animation: false }
              }
            ],
            marks
          })}
          style={{ height: 450 }}
          toolbar={{
            visibles: ['download', 'save_image', 'refresh'],
            download: {
              onClick() {
                downlaodRawDataHandler();
              },
              tooltip: 'DOWNLOAD_DATA'
            },
            onRefresh: () => handleRefresh(x, y)
          }}
          yAxisMeta={{ ...property, unit: property.unit }}
        />
      </Col>
      <Col flex='300px'>
        <AnalysisSidebarCollapse
          defaultActiveKey={['overview', 'forecast', 'marklist']}
          items={[
            {
              key: 'overview',
              label: intl.get('BASIC_INFORMATION'),
              children: (
                <Card>
                  <Descriptions
                    items={[
                      { label: intl.get('SETTING_RANGE'), children: `${range}g` },
                      {
                        label: intl.get('SETTING_SAMPLING_FREQUNECY'),
                        children: `${frequency}Hz`
                      },
                      { label: intl.get('SETTING_SAMPLING_NUMBER'), children: number },
                      {
                        label: intl.get('motor.rotation_speed'),
                        children: rotation_speed ? `${rotation_speed}RPM` : '-'
                      }
                    ]}
                  />
                </Card>
              ),
              styles: { body: { borderTop: 'solid 1px #f0f0f0' } }
            },
            {
              key: 'forecast',
              label: intl.get('data.analysis'),
              children: (
                <Card>
                  <Descriptions
                    items={[
                      { label: '峰值', children: '-' },
                      { label: '峰峰值', children: '-' },
                      { label: '有效值', children: '-' },
                      { label: '歪度', children: '-' },
                      { label: '峭度', children: '-' }
                    ]}
                  />
                </Card>
              )
            },
            {
              key: 'marklist',
              label: intl.get('mark'),
              children: <MarkList />,
              styles: { body: { borderTop: 'solid 1px #f0f0f0' } }
            }
          ]}
        />
      </Col>
    </Grid>
  );
};
