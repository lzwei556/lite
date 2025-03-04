import React from 'react';
import { Col, Spin } from 'antd';
import { ChartMark, Card, Flex, Grid } from '../../../components';
import { RangeDatePicker } from '../../../components/rangeDatePicker';
import dayjs from '../../../utils/dayjsUtils';
import { useDateRange, useTrendData } from './useTrend';
import { AnalysisContent } from './analysisContent';
import { Trend } from './trend';

export const Index = ({ id }: { id: number }) => {
  const { range, setRange } = useDateRange();
  const { loading, data } = useTrendData(id, range);
  const [selected, setSelected] = React.useState<number | undefined>();
  const timestamp = selected ?? data.find((d) => !!d.selected)?.timestamp;
  const lines: string[] = [];
  if (timestamp) {
    lines.push(dayjs.unix(timestamp).local().format('YYYY-MM-DD HH:mm:ss'));
  }

  return (
    <Grid>
      <Col span={24}>
        <Card>
          <Flex>
            <RangeDatePicker onChange={setRange} />
          </Flex>
        </Card>
      </Col>
      <Col span={24}>
        <Spin spinning={loading}>
          {lines.length > 0 ? (
            <Grid>
              <Col span={24}>
                <ChartMark.Context
                  initial={{
                    cursor: 'line',
                    marks: lines.map((line) => ({ name: line, data: line }))
                  }}
                >
                  <Trend data={data} onClick={(t) => setSelected(dayjs(t).unix())} />
                </ChartMark.Context>
              </Col>
              {timestamp && (
                <Col span={24}>
                  <AnalysisContent id={id} timestamp={timestamp} key={timestamp} />
                </Col>
              )}
            </Grid>
          ) : null}
        </Spin>
      </Col>
    </Grid>
  );
};
