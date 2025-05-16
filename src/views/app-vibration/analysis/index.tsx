import React from 'react';
import { Col, Empty, Spin } from 'antd';
import { ChartMark, Card, Flex, Grid, useRange, RangeDatePicker } from '../../../components';
import { Dayjs } from '../../../utils';
import { MonitoringPointRow, TrendData } from '../../asset-common';
import { useTrendData } from './useTrend';
import { AnalysisContent } from './analysisContent';
import { Trend } from './trend';

export const Index = ({
  id,
  attributes
}: {
  id: number;
  attributes: MonitoringPointRow['attributes'];
}) => {
  const { numberedRange, setRange } = useRange();
  const { loading, data } = useTrendData(id, numberedRange);

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
          <Content data={data} id={id} attributes={attributes} key={JSON.stringify(data)} />
        </Spin>
      </Col>
    </Grid>
  );
};

function Content({
  data,
  id,
  attributes
}: {
  data: TrendData[];
  id: number;
  attributes: MonitoringPointRow['attributes'];
}) {
  const [selected, setSelected] = React.useState<number | undefined>(
    data.find((d) => !!d.selected)?.timestamp
  );
  const lines: string[] = [];
  if (selected) {
    lines.push(Dayjs.format(selected));
  }
  if (lines.length === 0) {
    return (
      <Card>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );
  } else {
    return (
      <Grid>
        <Col span={24}>
          <ChartMark.Context
            initial={{
              cursor: 'line',
              marks: lines.map((line) => ({
                name: line,
                data: line,
                chartPorps: ChartMark.Axis_Mark_Line_Style_Props
              }))
            }}
          >
            <Trend attributes={attributes} data={data} onClick={setSelected} />
          </ChartMark.Context>
        </Col>
        {selected && (
          <Col span={24}>
            <AnalysisContent
              id={id}
              attributes={attributes}
              timestamp={selected}
              timestamps={data.map(({ timestamp }) => timestamp)}
            />
          </Col>
        )}
      </Grid>
    );
  }
}
