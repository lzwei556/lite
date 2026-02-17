import React from 'react';
import { Checkbox, Col, List } from 'antd';
import { CardChart, chartColors, Grid } from 'components';
import { Dayjs } from 'utils';
import { useGlobalStyles } from 'styles';
import { AnalysisProps } from './useProps';

export const WaterFall = ({
  trend: { timestamps },
  intermediateData: { timeDomains }
}: AnalysisProps) => {
  const { selected, toggleTimestamp, getDataList, loading } = timeDomains;
  const { colorBorderStyle, colorTextSecondaryStyle, colorTextDescriptionStyle } =
    useGlobalStyles();

  return (
    <Grid wrap={false}>
      <Col flex='200px' style={{ overflow: 'auto', maxHeight: 480 }}>
        <List
          dataSource={timestamps.sort((prev, crt) => crt - prev)}
          renderItem={(item) => {
            return (
              <List.Item>
                <Checkbox
                  checked={selected.includes(item)}
                  onChange={(e) => {
                    toggleTimestamp(item);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  value={item}
                  disabled={selected.length >= 5 && !selected.includes(item)}
                >
                  {Dayjs.format(item)}
                </Checkbox>
              </List.Item>
            );
          }}
        />
      </Col>
      <Col flex='auto'>
        <CardChart
          cardProps={{
            style: { border: `solid 1px ${colorBorderStyle.color}` }
          }}
          loading={loading}
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
            series: getDataList()
              .filter((t) => selected.includes(t.timestamp))
              .map((timeDomain) => {
                const { x, y, timestamp } = timeDomain;
                const name = Dayjs.format(timestamp);

                return {
                  type: 'line3D',
                  data: x.map((n, i) => [n, name, y[i]]),
                  name
                };
              })
          }}
          style={{ height: 400 }}
        />
      </Col>
    </Grid>
  );
};
