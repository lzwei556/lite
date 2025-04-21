import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { ChartMark, Grid } from '../../../components';
import { AnalysisSidebarCollapse } from '../../../features';
import { power } from '../../asset-common';
import { AnalysisCommonProps } from './analysisContent';
import { useWindow, Window } from './settings';
import CenterSide from './centerSide';
import { MarkList, Toolbar, useMarkChartProps } from './mark';

export const Power = ({ axis, property, originalDomain }: AnalysisCommonProps) => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<{ x: string[]; y: number[] }>();
  const { x = [], y = [] } = data || {};
  const { window, setWindow } = useWindow();
  const [activeKey, setActiveKey] = React.useState('marklist');
  const { marks, handleClick, isTypeSideband, handleRefresh } = useMarkChartProps();

  React.useEffect(() => {
    handleRefresh(x, y);
  }, [handleRefresh, x, y]);

  React.useEffect(() => {
    if (originalDomain) {
      const { frequency, fullScale, range, values } = originalDomain;
      setLoading(true);
      power({
        property: property.value,
        data: values,
        fs: frequency,
        full_scale: fullScale,
        range,
        window
      })
        .then(({ x, y }) => setData({ x: x.map((n) => `${n}`), y }))
        .finally(() => setLoading(false));
    } else {
      setData(undefined);
    }
  }, [originalDomain, property.value, window]);

  return (
    <Grid>
      <Col flex='auto'>
        <ChartMark.Chart
          cardProps={{
            extra: <Toolbar hiddens={['Top10']} />,
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
            extra: <Window onOk={setWindow} key='window' />
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
