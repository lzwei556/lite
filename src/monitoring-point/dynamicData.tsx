import React from 'react';
import { Button, Col, Empty, Spin } from 'antd';
import intl from 'react-intl-universal';
import { Card, Flex, Grid, Table, useRange, RangeDatePicker } from '../components';
import { Dayjs } from '../utils';
import usePermission, { Permission } from '../permission/permission';
import { getFilename } from '../utils/format';
import { useLocaleContext } from '../localeProvider';
import { BatchDownlaodWaveDataModal } from './batchDownlaodWaveDataModal';
import { downloadRawHistory, getDataOfMonitoringPoint, getDynamicData } from './services';
import { DataType } from './types';

type DynamicDataProps<T> = {
  children: (values: T) => React.ReactElement;
  dataType: DataType;
  filters?: { field: string; axis: number };
  id: number;
};
type TimestampObj = { timestamp: number };

export function DynamicData<T>(props: DynamicDataProps<T>) {
  const { dataType, id } = props;
  const { numberedRange, setRange } = useRange();
  const { loading, timestamps } = useFetchingTimestamps(id, numberedRange, dataType);
  const render = (timestamps: TimestampObj[]) => {
    if (timestamps.length === 0) {
      return (
        <Card>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Card>
      );
    } else {
      return <Timestamps {...{ ...props, timestamps }} />;
    }
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
      {timestamps && (
        <Col span={24}>
          <Spin spinning={loading}>{render(timestamps)}</Spin>
        </Col>
      )}
    </Grid>
  );
}

function useFetchingTimestamps(id: number, range: [number, number], dataType: DataType) {
  const [timestamps, setTimestamps] = React.useState<{ timestamp: number }[] | undefined>();
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(true);
    const [from, to] = range;
    getDataOfMonitoringPoint(id, from, to, dataType).then((data) => {
      setTimestamps(data.map(({ timestamp }) => ({ timestamp })));
      setLoading(false);
    });
    return () => {
      setLoading(true);
      setTimestamps(undefined);
    };
  }, [range, id, dataType]);
  return { loading, timestamps };
}

function Timestamps<T>(props: DynamicDataProps<T> & { timestamps: TimestampObj[] }) {
  const { timestamps, ...rest } = props;
  const { language } = useLocaleContext();
  const [timestamp, setTimestamp] = React.useState(timestamps[0].timestamp);

  return (
    <Grid wrap={false}>
      <Col flex='300px'>
        <TimestampsTable
          {...rest}
          onRowClick={setTimestamp}
          onDownload={(timestamp) => {
            const { id, dataType, filters } = rest;
            downloadRawHistory(
              id,
              timestamp,
              language === 'en-US' ? 'en' : 'zh',
              dataType,
              filters
            ).then((res) => {
              const url = window.URL.createObjectURL(new Blob([res.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', getFilename(res));
              document.body.appendChild(link);
              link.click();
            });
          }}
          timestamp={timestamp}
          timestamps={timestamps}
        />
      </Col>
      <Col flex='auto'>
        <Timestamp {...{ ...rest, timestamp }} />
      </Col>
    </Grid>
  );
}

function TimestampsTable<T>(
  props: DynamicDataProps<T> & {
    onDownload: (timestamp: number) => void;
    onRowClick: (timestamp: number) => void;
    timestamp: number;
    timestamps: TimestampObj[];
  }
) {
  const { onDownload, onRowClick, timestamp, timestamps } = props;
  const { hasPermission } = usePermission();
  const [batchDownloadModalVisible, setBatchDownloadModalVisible] = React.useState(false);

  return (
    <>
      <Table
        cardProps={{ style: { height: '100%' } }}
        header={{
          toolbar: [
            <Button onClick={() => setBatchDownloadModalVisible(true)}>
              {intl.get('BATCH_DOWNLOAD')}
            </Button>
          ]
        }}
        scroll={{ y: 700 }}
        showHeader={false}
        columns={[
          {
            title: intl.get('TIMESTAMP'),
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (timestamp: number) => Dayjs.format(timestamp)
          },
          {
            title: intl.get('OPERATION'),
            key: 'action',
            render: (text: TimestampObj) => {
              if (hasPermission(Permission.DeviceRawDataDownload)) {
                return (
                  <Button
                    onClick={() => {
                      onDownload(text.timestamp);
                    }}
                  >
                    <a>{intl.get('DOWNLOAD')}</a>
                  </Button>
                );
              }
            },
            width: 90
          }
        ]}
        pagination={false}
        dataSource={timestamps}
        rowClassName={(record) => (record.timestamp === timestamp ? 'ant-table-row-selected' : '')}
        onRow={(record) => ({
          onClick: () => {
            onRowClick(record.timestamp);
          },
          onMouseLeave: () => (window.document.body.style.cursor = 'default'),
          onMouseEnter: () => (window.document.body.style.cursor = 'pointer')
        })}
        rowKey={(row) => row.timestamp}
      />
      <BatchDownlaodWaveDataModal
        open={batchDownloadModalVisible}
        onCancel={() => setBatchDownloadModalVisible(false)}
        id={props.id}
        type={props.dataType}
        timestamps={timestamps}
        isVibration={!!props.filters}
      />
    </>
  );
}

function Timestamp<T>(props: DynamicDataProps<T> & TimestampObj) {
  const { children, ...rest } = props;
  const { data, loading } = useFetchingTimestamp<T>(rest);
  return <Spin spinning={loading}>{data && children(data)}</Spin>;
}

function useFetchingTimestamp<T>(req: Omit<DynamicDataProps<T>, 'children'> & TimestampObj) {
  const { dataType, filters, id, timestamp } = req;
  const [data, setData] = React.useState<T>();
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(true);
    getDynamicData<{ values: T; timestamp: number }>(id, timestamp, dataType, filters).then(
      (data) => {
        setData(data.values);
        setLoading(false);
      }
    );
  }, [id, timestamp, dataType, filters]);
  return { data, loading };
}
