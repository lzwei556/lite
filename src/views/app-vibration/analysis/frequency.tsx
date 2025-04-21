import React from 'react';
import { Col, Divider } from 'antd';
import intl from 'react-intl-universal';
import { ChartMark, Card, Descriptions, Grid } from '../../../components';
import { AnalysisSidebarCollapse } from '../../../features';
import { frequency } from '../../asset-common';
import { AnalysisCommonProps } from './analysisContent';
import { MarkList, SingleDoubleToggle, useMarkChartProps } from './mark';

export const Frequency = ({ axis, property, timeDomain, originalDomain }: AnalysisCommonProps) => {
  const { range, frequency: timeDomainFrequency, number } = timeDomain?.data || {};
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<{ x: string[]; y: number[] }>();
  const { x = [], y = [] } = data || {};
  const [activeKey, setActiveKey] = React.useState('overview');
  const { marks, handleClick, handleRefresh } = useMarkChartProps();

  React.useEffect(() => {
    handleRefresh(x, y);
  }, [handleRefresh, x, y]);

  React.useEffect(() => {
    if (property.value && originalDomain) {
      const { frequency: fs, fullScale, range, values } = originalDomain;
      setLoading(true);
      frequency({
        property: property.value,
        data: values,
        fs,
        full_scale: fullScale,
        range,
        window: 'hann'
      })
        .then(({ x, y }) => setData({ x: x.map((n) => `${n}`), y }))
        .finally(() => setLoading(false));
    } else {
      setData(undefined);
    }
  }, [property.value, originalDomain]);

  return (
    <Grid>
      <Col flex='auto'>
        <ChartMark.Chart
          cardProps={{
            extra: <SingleDoubleToggle />,
            style: { position: 'relative', border: 'solid 1px #d3d3d3' }
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
              yAxis: { name: property.unit },
              dataZoom: [{ start: 0, end: 100 }],
              grid: { top: 60, bottom: 60, right: 30 }
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
                data: { [intl.get(axis.label)]: y ?? [] },
                xAxisValues: x ?? [],
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
                        children: `${timeDomainFrequency}Hz`
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
                <Card styles={{ body: { overflowY: 'auto', maxHeight: 300 } }}>
                  <Descriptions
                    items={[
                      { label: '1x倍频', children: '-' },
                      { label: '2x倍频', children: '-' },
                      { label: '3x倍频', children: '-' },
                      { label: '4x倍频', children: '-' },
                      { label: '5x倍频', children: '-' },
                      { label: '6x倍频', children: '-' },
                      { label: '7x倍频', children: '-' },
                      { label: '8x倍频', children: '-' },
                      { label: '9x倍频', children: '-' },
                      { label: '10x倍频', children: '-' }
                    ]}
                  />
                  <Divider />
                  <Descriptions
                    items={[
                      { label: 'BPFI', children: '-' },
                      { label: 'BPFO', children: '-' },
                      { label: 'BSF', children: '-' },
                      { label: 'FTF', children: '-' }
                    ]}
                  />
                  <Divider />
                  <Descriptions items={[{ label: '边频', children: '-' }]} />
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
