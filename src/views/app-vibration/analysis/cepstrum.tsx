import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { ChartMark, Grid } from '../../../components';
import { cepstrum } from '../../asset-common';
import { AnalysisCommonProps } from './analysisContent';
import { useWindow, Window } from './settings';

export const Cepstrum = ({ axis, property, originalDomain }: AnalysisCommonProps) => {
  const { visibledMarks, dispatchMarks } = ChartMark.useContext();
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<{ x: string[]; y: number[] }>();
  const { x = [], y = [] } = data || {};
  const { window, setWindow } = useWindow();

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
                xAxisValues: x,
                raw: { animation: false }
              }
            ],
            visibledMarks
          )}
          style={{ height: 450 }}
          toolbar={{
            visibles: ['refresh', 'save_image'],
            extra: <Window onOk={setWindow} key='window' />
          }}
          yAxisMeta={{ ...property, unit: property.unit }}
        />
      </Col>
      <Col flex='300px'>
        <ChartMark.List
          cardProps={{
            title: intl.get('mark'),
            style: { border: 'solid 1px #d3d3d3' },
            styles: { body: { overflowY: 'auto', maxHeight: 500 } }
          }}
        />
      </Col>
    </Grid>
  );
};
