import React from 'react';
import { Col, Empty, Spin } from 'antd';
import { Card, Flex, Grid, useRange, RangeDatePicker, ChartMark } from '../../../../components';
import { AssetRow, HistoryData } from '../../../../asset-common';
import { useHistoryDatas } from '../../utils';
import { PointsLineChart } from './pointsLineChart';
import { PointsScatterChart } from './pointsScatterChart';
import intl from 'react-intl-universal';
import { useRequest } from 'ahooks';
import request from 'utils/request';
import { Dayjs } from 'utils';

export const History = ({
  flange,
  historyDatas
}: {
  flange: AssetRow;
  historyDatas: { name: string; data: HistoryData }[] | undefined;
}) => {
  const { numberedRange, setRange } = useRange();
  const { historyDatas: internalHistorys, loading } =
    useHistoryDatas(flange, numberedRange) ?? historyDatas;
  const getTimestamp = () => {
    if (internalHistorys && internalHistorys.length > 0) {
      const { data } = internalHistorys[0];
      if (data && data.length > 0) {
        return data[data.length - 1].timestamp;
      }
    }
  };

  const [timestamp, setTimestamp] = React.useState<number>();
  const internalTimestamp = getTimestamp() ?? timestamp;
  const { data, loading: flangeLoading, runAsync } = useFlange(flange.id, internalTimestamp);
  const chartProps = ChartMark.useAxisMarkLineStyleProps();

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
          {internalTimestamp ? (
            <ChartMark.Context
              initial={
                internalTimestamp
                  ? [
                      {
                        name: `${Dayjs.format(internalTimestamp)}`,
                        type: 'Peak',
                        data: `${Dayjs.format(internalTimestamp)}`,
                        chartProps
                      }
                    ]
                  : undefined
              }
            >
              <Grid>
                <Col span={14}>
                  <PointsLineChart
                    flange={flange}
                    historyDatas={internalHistorys}
                    handleClick={(timestamp) => {
                      setTimestamp(timestamp);
                      runAsync(flange.id, timestamp);
                    }}
                  />
                </Col>
                <Col span={10}>
                  <Card title={intl.get('BOLT_DIAGRAM')}>
                    <PointsScatterChart
                      asset={data ? data : { ...flange, monitoringPoints: [] }}
                      loading={flangeLoading}
                    />
                  </Card>
                </Col>
              </Grid>
            </ChartMark.Context>
          ) : (
            <Grid>
              <Col span={14}>
                <Card title={intl.get('TREND_CHART')}>
                  <Flex style={{ height: 600 }} justify='center' align='center'>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  </Flex>
                </Card>
              </Col>
              <Col span={10}>
                <Card title={intl.get('BOLT_DIAGRAM')}>
                  <Flex style={{ height: 600 }} justify='center' align='center'>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  </Flex>
                </Card>
              </Col>
            </Grid>
          )}
        </Spin>
      </Col>
    </Grid>
  );
};

const useFlange = (id: number, timestamp?: number) => {
  const { loading, data, runAsync } = useRequest(getAssetByTimestamp, {
    ready: !!timestamp,
    defaultParams: [id, timestamp]
  });
  return { loading, data, runAsync };
};

const getAssetByTimestamp = async (id: number, timestamp?: number) => {
  const { data } = await request.get<AssetRow>(`assets/${id}?snapshot_time=${timestamp}`);
  return data.data;
};
