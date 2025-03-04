import React from 'react';
import { Col } from 'antd';
import { Card, Flex, Grid } from '../../../../components';
import { oneWeekNumberRange, RangeDatePicker } from '../../../../components/rangeDatePicker';
import { AssetRow, HistoryData, Points } from '../../../asset-common';
import { useHistoryDatas } from '../../utils';
import { PointsLineChart } from './pointsLineChart';
import { PointsScatterChart } from './pointsScatterChart';

export const History = ({
  asset,
  historyDatas
}: {
  asset: AssetRow;
  historyDatas: { name: string; data: HistoryData; height?: number; radius?: number }[] | undefined;
}) => {
  const realPoints = Points.filter(asset.monitoringPoints);
  const [range, setRange] = React.useState<[number, number]>(oneWeekNumberRange);
  const internalHistorys = useHistoryDatas(asset, range) ?? historyDatas;
  const firstPoint = realPoints[0];

  return (
    <Grid>
      <Col span={24}>
        <Card>
          <Flex>
            <RangeDatePicker onChange={setRange} showFooter={true} />
          </Flex>
        </Card>
      </Col>
      <Col span={8}>
        <PointsScatterChart
          data={
            internalHistorys?.map((h) => {
              return {
                name: h.name,
                history: h.data,
                height: h.height,
                radius: h.radius
              };
            }) ?? []
          }
          type={firstPoint.type}
        />
      </Col>
      <Col span={16}>
        <PointsLineChart asset={asset} historyDatas={internalHistorys} />
      </Col>
    </Grid>
  );
};
