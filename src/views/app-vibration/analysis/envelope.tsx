import React from 'react';
import { Col, Divider } from 'antd';
import intl from 'react-intl-universal';
import { ChartMark, Card, Descriptions, Grid } from '../../../components';
import { roundValue } from '../../../utils/format';
import { envelope } from '../../asset-common';
import { AnalysisCommonProps } from './analysisContent';
import { useWindow, Window, FilterTypeRelated, useFilterTypeRelated } from './settings';
import { AnalysisSidebarCollapse } from '../../../features';

export const Envelope = ({ axis, property, timeDomain, originalDomain }: AnalysisCommonProps) => {
  const { range, frequency: timeDomainFrequency, number } = timeDomain?.data || {};
  const { visibledMarks, dispatchMarks } = ChartMark.useContext();
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<{ x: string[]; y: number[] }>();
  const { x = [], y = [] } = data || {};
  const { window, setWindow } = useWindow();
  const { filter_type_related, setFilter_type_related } = useFilterTypeRelated();
  React.useEffect(() => {
    if (originalDomain) {
      const { frequency, fullScale, range, values } = originalDomain;
      setLoading(true);
      envelope({
        property: property.value,
        data: values,
        fs: frequency,
        full_scale: fullScale,
        range,
        window,
        ...filter_type_related
      })
        .then(({ x, y }) => setData({ x: x.map((n) => `${roundValue(n)}`), y }))
        .finally(() => setLoading(false));
    } else {
      setData(undefined);
    }
  }, [originalDomain, property.value, window, filter_type_related]);

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
                data: { [intl.get(axis.label)]: y },
                xAxisValues: x
              }
            ],
            visibledMarks
          )}
          style={{ height: 450 }}
          toolbar={{
            visibles: ['refresh', 'save_image'],
            extra: [
              <Window onOk={setWindow} key='window' />,
              <FilterTypeRelated
                onOk={setFilter_type_related}
                initial={[
                  filter_type_related.cutoff_range_low!,
                  filter_type_related.cutoff_range_high!
                ]}
                key='filter_type'
              />
            ]
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
