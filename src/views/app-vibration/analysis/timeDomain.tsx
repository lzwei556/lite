import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { ChartMark, Card, Descriptions, Grid } from '../../../components';
import { AnalysisCommonProps } from './analysisContent';
import { AnalysisSidebarCollapse } from '../../../features';

export const TimeDomain = ({ axis, property, timeDomain }: AnalysisCommonProps) => {
  const { loading, data } = timeDomain || {};
  const { x = [], y = [], range, frequency, number } = data || {};
  const { marks, visibledMarks, dispatchMarks } = ChartMark.useContext();

  return (
    <Grid>
      <Col flex='auto'>
        <ChartMark.Chart
          cardProps={{
            style: { border: 'solid 1px #d3d3d3' }
          }}
          config={{
            opts: {
              xAxis: { name: 's' },
              yAxis: { name: property.unit },
              dataZoom: [{ start: 0, end: 100 }],
              grid: { top: 30, bottom: 60, right: 30 }
            }
          }}
          loading={loading}
          onEvents={{
            brushEnd: (areaCoords: [number, number][]) => {
              const areaValues = areaCoords.map(([start, end]) => {
                const xAxisValues = x ?? [];
                return [xAxisValues[start], xAxisValues[end]];
              }) as [string, string][];
              if (areaValues.length > 0) {
                areaValues.forEach((area, i) => {
                  dispatchMarks({
                    type: 'append_multiple',
                    mark: {
                      name: areaCoords[i].join(),
                      data: [
                        [area[0], 'median'],
                        [area[1], 'median']
                      ],
                      dataProps: { lineStyle: { color: 'transparent' } },
                      description: area.join()
                    }
                  });
                });
              }
            },
            click: ([x, y]: [string, number]) =>
              dispatchMarks({
                type: 'append_multiple',
                mark: { name: `${x}${y}`, data: [x, y], value: y, description: x }
              })
          }}
          series={ChartMark.mergeMarkDatas(
            [
              {
                data: { [intl.get(axis.label)]: y },
                xAxisValues: x,
                raw: { animation: false }
              }
            ],
            visibledMarks
          )}
          style={{ height: 450 }}
          toolbar={{
            onEnableAreaSelection: (ins) => {
              ChartMark.brushAreas(marks, ins);
            }
          }}
          yAxisMeta={{ ...property, unit: property.unit }}
        />
      </Col>
      <Col flex='300px'>
        <AnalysisSidebarCollapse
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
              children: <ChartMark.List />,
              styles: { body: { borderTop: 'solid 1px #f0f0f0' } }
            }
          ]}
        />
      </Col>
    </Grid>
  );
};
