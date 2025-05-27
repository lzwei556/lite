import React from 'react';
import { Col, Divider } from 'antd';
import intl from 'react-intl-universal';
import { ChartMark, Card, Descriptions, Grid } from '../../../components';
import { AnalysisSidebarCollapse } from '../../../features';
import { envelope } from '../../asset-common';
import { AnalysisCommonProps } from './analysisContent';
import { useWindow, Window, FilterTypeRelated, useFilterTypeRelated } from './settings';
import CenterSide from './centerSide';
import { useMarkChartProps, MarkList, Toolbar } from './mark';

export const Envelope = ({
  axis,
  property,
  timeDomain,
  originalDomain,
  parent
}: AnalysisCommonProps) => {
  const { range, frequency: timeDomainFrequency, number } = timeDomain?.data || {};
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<{ x: string[]; y: number[] }>();
  const { x = [], y = [] } = data || {};
  const [activeKey, setActiveKey] = React.useState('overview');
  const { window, setWindow } = useWindow();
  const { filter_type_related, setFilter_type_related } = useFilterTypeRelated();
  const { marks, handleClick, isTypeSideband, handleRefresh } = useMarkChartProps();
  //@ts-ignore
  const rotation_speed = parent.attributes?.rotation_speed;

  React.useEffect(() => {
    handleRefresh(x, y);
  }, [handleRefresh, x, y]);

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
        .then(({ x, y }) => setData({ x: x.map((n) => `${n}`), y }))
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
            extra: <Toolbar />,
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
                data: { [intl.get(axis.label)]: y },
                xAxisValues: x
              }
            ],
            marks
          })}
          style={{ height: 450 }}
          toolbar={{
            visibles: ['save_image', 'refresh'],
            onRefresh: () => handleRefresh(x, y),
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
        >
          {isTypeSideband && <CenterSide.Switcher />}
        </ChartMark.Chart>
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
                      { label: intl.get('SETTING_SAMPLING_NUMBER'), children: number },
                      {
                        label: intl.get('motor.rotation_speed'),
                        children: rotation_speed ? `${rotation_speed}RPM` : '-'
                      }
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
