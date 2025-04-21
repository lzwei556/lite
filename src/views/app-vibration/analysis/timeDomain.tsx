import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { ChartMark, Card, Descriptions, Grid } from '../../../components';
import { AnalysisSidebarCollapse } from '../../../features';
import { AnalysisCommonProps } from './analysisContent';
import { MarkList, SingleDoubleToggle, useMarkChartProps } from './mark';

export const TimeDomain = ({ axis, property, timeDomain }: AnalysisCommonProps) => {
  const { loading, data } = timeDomain || {};
  const { x = [], y = [], range, frequency, number, xAxisUnit } = data || {};
  const [activeKey, setActiveKey] = React.useState('overview');
  const { marks, handleClick, handleRefresh } = useMarkChartProps();

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
              setActiveKey('marklist');
            }
          }}
          series={ChartMark.mergeMarkDatas({
            series: [
              {
                data: { [intl.get(axis.label)]: y },
                xAxisValues: x,
                raw: { animation: false }
              }
            ],
            marks
          })}
          style={{ height: 450 }}
          toolbar={{
            visibles: ['save_image', 'refresh'],
            onRefresh: () => handleRefresh(x, y)
          }}
          yAxisMeta={{ ...property, unit: property.unit }}
        />
      </Col>
      <Col flex='300px'>
        <AnalysisSidebarCollapse
          activeKey={activeKey}
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
                      { label: intl.get('SETTING_SAMPLING_NUMBER'), children: number }
                    ]}
                  />
                </Card>
              )
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
          onChange={(keys) => {
            setActiveKey(keys[0]);
          }}
        />
      </Col>
    </Grid>
  );
};
