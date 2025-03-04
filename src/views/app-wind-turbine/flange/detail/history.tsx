import React from 'react';
import { Col } from 'antd';
import { Card, Flex, Grid } from '../../../../components';
import { oneWeekNumberRange, RangeDatePicker } from '../../../../components/rangeDatePicker';
import { AssetRow, HistoryData } from '../../../asset-common';
import { useHistoryDatas } from '../../utils';
import { PointsLineChart } from './pointsLineChart';

export const History = ({
  flange,
  historyDatas
}: {
  flange: AssetRow;
  historyDatas: { name: string; data: HistoryData }[] | undefined;
}) => {
  const [range, setRange] = React.useState<[number, number]>(oneWeekNumberRange);
  const internalHistorys = useHistoryDatas(flange, range) ?? historyDatas;

  return (
    <Grid>
      <Col span={24}>
        <Card>
          <Flex>
            <RangeDatePicker onChange={setRange} showFooter={true} />
          </Flex>
        </Card>
      </Col>
      <Col span={24}>
        <PointsLineChart flange={flange} historyDatas={internalHistorys} />
      </Col>
    </Grid>
  );
};
