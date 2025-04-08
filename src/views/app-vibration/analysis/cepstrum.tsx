import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { ChartMark, Grid } from '../../../components';
import { cepstrum } from '../../asset-common';
import { AnalysisCommonProps } from './analysisContent';
import { useWindow, Window } from './settings';
import { MarkList, SingleDoubleToggle, useInitialMarks, useMarkChartProps } from './mark';
import { AnalysisSidebarCollapse } from '../../../features';

export const Cepstrum = ({ axis, property, originalDomain }: AnalysisCommonProps) => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<{ x: string[]; y: number[] }>();
  const { x = [], y = [] } = data || {};
  const { window, setWindow } = useWindow();
  const [activeKey, setActiveKey] = React.useState('marklist');
  const { marks, handleClick } = useMarkChartProps();

  useInitialMarks(x, y);

  React.useEffect(() => {
    if (originalDomain) {
      const { frequency, fullScale, range, values } = originalDomain;
      setLoading(true);
      cepstrum({
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
            extra: <SingleDoubleToggle />,
            style: { border: 'solid 1px #d3d3d3' }
          }}
          config={{
            opts: {
              xAxis: { name: 's' },
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
          series={ChartMark.mergeMarkDatas(
            [
              {
                data: { [intl.get(axis.label)]: y },
                xAxisValues: x,
                raw: { animation: false }
              }
            ],
            marks
          )}
          style={{ height: 450 }}
          toolbar={{
            visibles: ['save_image'],
            extra: <Window onOk={setWindow} key='window' />
          }}
          yAxisMeta={{ ...property, unit: property.unit }}
        />
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
