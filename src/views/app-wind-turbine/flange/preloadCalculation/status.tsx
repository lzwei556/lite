import * as React from 'react';
import { Col, Empty, Spin } from 'antd';
import intl from 'react-intl-universal';
import dayjs from '../../../../utils/dayjsUtils';
import { Card, Flex, Grid, Table } from '../../../../components';
import { RangeDatePicker, oneWeekNumberRange } from '../../../../components/rangeDatePicker';
import { AssetRow, getDataOfAsset, getFlangeData, Point } from '../../../asset-common';
import { SingleStatus, StatusData } from './single';

export const Status: React.FC<AssetRow> = (props) => {
  const [range, setRange] = React.useState<[number, number]>(oneWeekNumberRange);
  const [timestamps, setTimestamps] = React.useState<{ timestamp: number }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [timestamp, setTimestamp] = React.useState<number>();
  const [loading2, setLoading2] = React.useState(true);
  const [flangeData, setFlangeData] = React.useState<StatusData>();

  React.useEffect(() => {
    if (range) {
      const [from, to] = range;
      getDataOfAsset(props.id, from, to).then((data) => {
        setTimestamps(data);
        setLoading(false);
      });
    }
  }, [range, props.id]);

  React.useEffect(() => {
    if (timestamps.length > 0) {
      setTimestamp(timestamps[0].timestamp);
    } else {
      setTimestamp(undefined);
    }
  }, [timestamps]);

  React.useEffect(() => {
    if (timestamp) {
      setLoading2(true);
      getFlangeData(props.id, timestamp).then((data) => {
        setFlangeData(data);
        setLoading2(false);
      });
    }
  }, [props.id, timestamp]);

  const renderTimestampsSearchResult = () => {
    if (loading) return <Spin />;
    if (timestamps.length === 0) {
      return (
        <Card>
          <Empty description={intl.get('NO_DATA_PROMPT')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Card>
      );
    } else {
      return (
        <Grid>
          <Col flex='220px'>{renderTimestampsTable()}</Col>
          <Col flex='auto'>{renderSelectedTimestampRelation()}</Col>
        </Grid>
      );
    }
  };

  const renderTimestampsTable = () => {
    return (
      <Table
        style={{ height: 648 }}
        showHeader={false}
        columns={[
          {
            title: intl.get('TIMESTAMP'),
            dataIndex: 'timestamp',
            key: 'timestamp',
            width: '80%',
            render: (timestamp: number) =>
              dayjs.unix(timestamp).local().format('YYYY-MM-DD HH:mm:ss')
          }
        ]}
        pagination={false}
        dataSource={timestamps}
        rowClassName={(record) => (record.timestamp === timestamp ? 'ant-table-row-selected' : '')}
        onRow={(record) => ({
          onClick: () => {
            if (record.timestamp !== timestamp) {
              setTimestamp(record.timestamp);
            }
          },
          onMouseLeave: () => (window.document.body.style.cursor = 'default'),
          onMouseEnter: () => (window.document.body.style.cursor = 'pointer')
        })}
        rowKey={(row) => row.timestamp}
      />
    );
  };

  const renderSelectedTimestampRelation = () => {
    if (!timestamp)
      return (
        <Empty
          description={intl.get('PLEASE_SELECT_SOMETHING', { something: intl.get('TIMESTAMP') })}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    if (loading2) return <Spin />;
    return (
      <SingleStatus
        properties={
          props.monitoringPoints && props.monitoringPoints.length > 0
            ? Point.getPropertiesByType(
                props.monitoringPoints[0].properties,
                props.monitoringPoints[0].type
              )
            : []
        }
        flangeData={flangeData}
      />
    );
  };

  return (
    <Grid>
      <Col span={24}>
        <Card>
          <Flex>
            <RangeDatePicker onChange={setRange} />
          </Flex>
        </Card>
      </Col>
      <Col span={24}>{renderTimestampsSearchResult()}</Col>
    </Grid>
  );
};
