import React from 'react';
import { Checkbox, Col, List } from 'antd';
import { CardChart, chartColors, Grid } from '../../../components';
import { AnalysisCommonProps } from './analysisContent';
import { Dayjs } from '../../../utils';

export const WaterFall = ({ timestamp, timestamps }: AnalysisCommonProps) => {
  const [selected, setSelected] = React.useState<number[]>([timestamp]);
  console.log('selected', selected);
  const formateds = selected.map((s) => Dayjs.format(s));

  console.log(
    formateds.map((y, i) => ({
      type: 'line3D',
      data: Array(20)
        .fill(-1)
        .map((n) => [Math.random(), y, Math.random() * 10]),
      name: y
    }))
  );

  return (
    <Grid wrap={false}>
      <Col flex='200px' style={{ overflow: 'auto', maxHeight: 480 }}>
        <Checkbox.Group value={selected} onChange={setSelected}>
          <List
            dataSource={timestamps}
            renderItem={(item) => (
              <List.Item>
                <Checkbox value={item}>{Dayjs.format(item)}</Checkbox>
              </List.Item>
            )}
          />
        </Checkbox.Group>
      </Col>
      <Col flex='auto'>
        <CardChart
          cardProps={{
            style: { border: 'solid 1px #d3d3d3' }
          }}
          // loading={loading}
          options={{
            color: chartColors[0],
            xAxis3D: {
              type: 'value',
              nameTextStyle: { color: '#333' }
            },
            yAxis3D: {
              type: 'category',
              nameTextStyle: { color: '#333' }
              // data: formateds
            },
            zAxis3D: {
              type: 'value',
              nameTextStyle: { color: '#333' }
            },
            grid3D: {
              boxHeight: 80,
              boxDepth: 80,
              boxWidth: 200,
              viewControl: { alpha: 20, beta: 0 },
              axisLine: { lineStyle: { color: '#888', width: 1 } },
              splitLine: { show: true, lineStyle: { color: '#888' } },
              axisLabel: { textStyle: { color: '#333' } }
            },
            //@ts-ignore
            series: formateds.map((y, i) => ({
              type: 'line3D',
              data: Array(20)
                .fill(-1)
                .map((n, j) => [Math.random() + j, y, Math.random() * j]),
              name: y
            }))
          }}
          style={{ height: 400 }}
        />
      </Col>
    </Grid>
  );
};
