import React from 'react';
import { Checkbox, Col, List } from 'antd';
import { CardChart, chartColors, Grid } from '../../../components';
import { AnalysisCommonProps } from './analysisContent';
import { Dayjs } from '../../../utils';
import { useGlobalStyles } from '../../../styles';

export const WaterFall = ({ timestamp, timestamps }: AnalysisCommonProps) => {
  const [selected, setSelected] = React.useState<number[]>([timestamp]);
  const formateds = selected.map((s) => Dayjs.format(s));
  const { colorBorderStyle, colorTextSecondaryStyle, colorTextDescriptionStyle } =
    useGlobalStyles();

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
            style: { border: `solid 1px ${colorBorderStyle.color}` }
          }}
          // loading={loading}
          options={{
            color: chartColors[0],
            xAxis3D: {
              type: 'value',
              nameTextStyle: colorTextSecondaryStyle
            },
            yAxis3D: {
              type: 'category',
              nameTextStyle: colorTextSecondaryStyle
              // data: formateds
            },
            zAxis3D: {
              type: 'value',
              nameTextStyle: colorTextSecondaryStyle
            },
            grid3D: {
              boxHeight: 80,
              boxDepth: 80,
              boxWidth: 200,
              viewControl: { alpha: 20, beta: 0 },
              axisLine: { lineStyle: { ...colorTextDescriptionStyle, width: 1 } },
              splitLine: { show: true, lineStyle: colorTextDescriptionStyle },
              axisLabel: { textStyle: colorTextSecondaryStyle }
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
