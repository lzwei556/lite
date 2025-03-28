import React from 'react';
import { Col, Divider } from 'antd';
import intl from 'react-intl-universal';
import { ChartMark, Card, Descriptions, Grid } from '../../../components';
import { roundValue } from '../../../utils/format';
import { frequency } from '../../asset-common';
import { AnalysisCommonProps } from './analysisContent';
import { AnalysisSidebarCollapse } from '../../../features';

export const Frequency = ({ axis, property, timeDomain, originalDomain }: AnalysisCommonProps) => {
  const { range, frequency: timeDomainFrequency, number } = timeDomain?.data || {};
  const { visibledMarks, dispatchMarks } = ChartMark.useContext();
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<{ x: string[]; y: number[] }>();
  const { x = [], y = [] } = data || {};
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
        .then(({ x, y }) => setData({ x: x.map((n) => `${roundValue(n)}`), y }))
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
            style: { border: 'solid 1px #d3d3d3' }
          }}
          config={{
            opts: {
              xAxis: { name: 'Hz' },
              yAxis: { name: property.unit },
              dataZoom: [{ start: 0, end: 100 }],
              grid: { top: 30, bottom: 60, right: 30 }
            }
          }}
          loading={loading}
          onEvents={{
            click: ([x, y]: [x: string, y: number]) => {
              dispatchMarks({
                type: 'append_multiple',
                mark: { name: `${x}${y}`, data: [x, y], value: y, description: x }
              });
            }
          }}
          series={ChartMark.mergeMarkDatas(
            [
              {
                data: { [intl.get(axis.label)]: y ?? [] },
                xAxisValues: x ?? [],
                raw: { animation: false }
              }
            ],
            visibledMarks
          )}
          style={{ height: 450 }}
          toolbar={{ visibles: ['refresh', 'save_image'] }}
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
              children: <ChartMark.List />,
              styles: { body: { borderTop: 'solid 1px #f0f0f0' } }
            }
          ]}
        />
      </Col>
    </Grid>
  );
};
