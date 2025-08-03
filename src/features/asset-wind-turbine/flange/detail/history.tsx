import React from 'react';
import { Col } from 'antd';
import { Card, Flex, Grid, useRange, RangeDatePicker } from '../../../../components';
import { AssetRow, HistoryData } from '../../../../asset-common';
import { useHistoryDatas } from '../../utils';
import { PointsLineChart } from './pointsLineChart';

export const History = ({
  flange,
  historyDatas
}: {
  flange: AssetRow;
  historyDatas: { name: string; data: HistoryData }[] | undefined;
}) => {
  const { numberedRange, setRange } = useRange();
  const internalHistorys = useHistoryDatas(flange, numberedRange) ?? historyDatas;

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
        <PointsLineChart flange={flange} historyDatas={internalHistorys} />
      </Col>
    </Grid>
  );
};
