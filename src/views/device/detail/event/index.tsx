import { FC, useCallback, useEffect, useState } from 'react';
import { Col, Button } from 'antd';
import intl from 'react-intl-universal';
import { RangeDatePicker, oneWeekNumberRange } from '../../../../components/rangeDatePicker';
import { Card, Flex, Grid, Table, transformPagedresult } from '../../../../components';
import { Device } from '../../../../types/device';
import dayjs from '../../../../utils/dayjsUtils';
import { BatchDeleteDeviceEventsRequest, PagingDeviceEventsRequest } from '../../../../apis/device';
import HasPermission from '../../../../permission';
import usePermission, { Permission } from '../../../../permission/permission';
import { store } from '../../../../store';
import { PageResult } from '../../../../types/page';

export interface DeviceEventProps {
  device: Device;
}

const DeviceEvent: FC<DeviceEventProps> = ({ device }) => {
  const [range, setRange] = useState<[number, number]>(oneWeekNumberRange);
  const [dataSource, setDataSource] = useState<PageResult<any[]>>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const { hasPermission } = usePermission();
  const isPlatformAccount =
    store.getState().permission.data.subject === 'admin' ||
    store.getState().permission.data.subject === '平台管理员';

  const fetchDeviceEvents = useCallback(
    (current: number, size: number) => {
      if (range) {
        const [from, to] = range;
        PagingDeviceEventsRequest(device.id, from, to, current, size).then(setDataSource);
      }
    },
    [range, device.id]
  );

  useEffect(() => {
    fetchDeviceEvents(1, 10);
  }, [fetchDeviceEvents]);

  const columns: any = [
    {
      title: intl.get('TYPE'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => {
        return intl.get(record.name);
      }
    },
    {
      title: intl.get('EVENT_CONTENT'),
      dataIndex: 'content',
      key: 'content',
      render: (text: string, record: any) => {
        return record.content ? intl.get(record.content).d(record.content) : record.content;
      }
    }
  ];
  if (isPlatformAccount) {
    columns.push({
      title: intl.get('DETAIL'),
      dataIndex: 'message',
      key: 'message',
      render: (text: string, record: any) => {
        return record.message ? intl.get(record.message).d(record.message) : record.message;
      }
    });
  }
  columns.push({
    title: intl.get('TIMESTAMP'),
    dataIndex: 'timestamp',
    key: 'timestamp',
    render: (timestamp: number) => {
      return dayjs.unix(timestamp).local().format('YYYY-MM-DD HH:mm:ss');
    }
  });

  const onBatchDelete = () => {
    BatchDeleteDeviceEventsRequest(device.id, selectedRowKeys).then(() => {
      setSelectedRowKeys([]);
      fetchDeviceEvents(1, 10);
    });
  };

  const rowSelection = {
    setSelectedRowKeys,
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeys(selectedRowKeys);
    }
  };
  const { paged, ds } = transformPagedresult(dataSource);
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
          columns={columns}
          dataSource={ds}
          header={{
            toolbar: [
              dataSource && dataSource.total > 0 && (
                <HasPermission value={Permission.DeviceEventDelete}>
                  <Button disabled={selectedRowKeys.length === 0} onClick={() => onBatchDelete()}>
                    {intl.get('BATCH_DELETE')}
                  </Button>
                </HasPermission>
              )
            ]
          }}
          pagination={{
            ...paged,
            onChange: fetchDeviceEvents
          }}
          rowSelection={hasPermission(Permission.DeviceEventDelete) ? rowSelection : undefined}
          rowKey={(row) => row.id}
        />
      </Col>
    </Grid>
  );
};

export default DeviceEvent;
