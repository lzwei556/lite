import React from 'react';
import intl from 'react-intl-universal';
import { transformPagedresult, useRange } from '../../../components';
import { PageResult } from '../../../types/page';
import usePermission, { Permission } from '../../../permission/permission';
import { store } from '../../../store';
import { BatchDeleteDeviceEventsRequest, PagingDeviceEventsRequest } from '../../../apis/device';
import { Device } from '../../../types/device';
import { Dayjs } from '../../../utils';
import { useButtonBindingsProps } from '../../../hooks';

export const useEvents = (device: Device) => {
  const { numberedRange, setRange } = useRange();
  const [dataSource, setDataSource] = React.useState<PageResult<any>>();

  const fetchDeviceEvents = React.useCallback(
    (current: number, size: number) => {
      if (numberedRange) {
        const [from, to] = numberedRange;
        PagingDeviceEventsRequest(device.id, from, to, current, size).then(setDataSource);
      }
    },
    [numberedRange, device.id]
  );

  React.useEffect(() => {
    fetchDeviceEvents(1, 10);
  }, [fetchDeviceEvents]);

  return { fetchDeviceEvents, dataSource, setRange };
};

export const useEventTableProps = ({
  device,
  dataSource,
  fetch
}: {
  device: Device;
  dataSource?: PageResult<any>;
  fetch: (crt: number, size: number) => void;
}) => {
  const { hasPermission } = usePermission();
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<any[]>([]);
  const onBatchDelete = () => {
    BatchDeleteDeviceEventsRequest(device.id, selectedRowKeys).then(() => {
      setSelectedRowKeys([]);
      fetch(1, 10);
    });
  };
  const rowSelection = {
    setSelectedRowKeys,
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeys(selectedRowKeys);
    }
  };
  const { paged, ds } = transformPagedresult(dataSource);
  return {
    tablePorps: {
      columns: useColumns(),
      dataSource: ds,
      pagination: { ...paged, onChange: fetch },
      rowSelection: hasPermission(Permission.DeviceEventDelete) ? rowSelection : undefined,
      rowKey: (row: Device) => row.id
    },
    header: {
      toolbar: {
        deleteProps: useButtonBindingsProps({
          disabled: selectedRowKeys.length === 0,
          onClick: onBatchDelete,
          children: intl.get('BATCH_DELETE')
        })
      }
    }
  };
};

const useColumns = () => {
  const isPlatformAccount =
    store.getState().permission.data.subject === 'admin' ||
    store.getState().permission.data.subject === '平台管理员';
  const columns: any = [
    {
      title: intl.get('TYPE'),
      dataIndex: 'name',
      key: 'name',
      render: (_: string, record: Device) => {
        return intl.get(record.name);
      }
    },
    {
      title: intl.get('EVENT_CONTENT'),
      dataIndex: 'content',
      key: 'content',
      render: (_: string, record: any) => {
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
    render: (timestamp: number) => Dayjs.format(timestamp)
  });
  return columns;
};
