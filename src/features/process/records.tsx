import { Col } from 'antd';
import {
  Card,
  Flex,
  Grid,
  RangeDatePicker,
  Table,
  transformPagedresult,
  useRange
} from 'components';
import React from 'react';
import { useFillRecords } from './use-services';
import { MonitoringPointRow } from 'monitoring-point';

export const FillRecords = ({ id }: MonitoringPointRow) => {
  const { numberedRange, setRange } = useRange();
  const [from, to] = numberedRange;
  const [page, setPage] = React.useState<{ size: number; page: number }>({ page: 1, size: 10 });
  const { data } = useFillRecords([id, { from, to, ...page }]);
  const { paged, ds } = transformPagedresult(data);

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
        <Table
          columns={[{dataIndex:''}]}
          dataSource={ds}
          pagination={{ ...paged, onChange: (page, size) => setPage({ page, size }) }}
        />
      </Col>
    </Grid>
  );
};
