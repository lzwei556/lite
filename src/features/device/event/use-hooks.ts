import React from 'react';
import { Translation } from 'locales/utils';
import { transformPagedresult } from '../../../components';
import { PageResult } from '../../../types/page';
import { BatchDeleteDeviceEventsRequest, PagingDeviceEventsRequest } from '../../../apis/device';
import { Device } from '../../../types/device';
import { Dayjs } from '../../../utils';
import { useButtonBindingsProps } from '../../../hooks';
import { useContext } from '..';
import { useGetIdentity } from '../../../providers/auth';
import { Permission, useCan } from '../../../providers/access-control';

export const useEvents = (device: Device) => {
  const { range, numberedRange, onChange } = useContext();
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

  return { fetchDeviceEvents, dataSource, range, onChange };
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
  const canDeleteDeviceEvent = useCan(Permission.DeviceEventDelete);
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
      rowSelection: canDeleteDeviceEvent ? rowSelection : undefined,
      rowKey: (row: Device) => row.id
    },
    header: {
      toolbar: {
        deleteProps: useButtonBindingsProps({
          disabled: selectedRowKeys.length === 0,
          onClick: onBatchDelete,
          children: Translation.get('common.action.delete')
        })
      }
    }
  };
};

const useColumns = () => {
  const identity = useGetIdentity();
  const columns: any = [
    {
      title: Translation.get('common.type'),
      dataIndex: 'name',
      key: 'name',
      render: (_: string, record: Device) => {
        return React.createElement(
          'span',
          { style: { display: 'inline-block', minWidth: 160 } },
          Translation.get(record.name)
        );
      }
    },
    {
      title: Translation.get('device.event.content'),
      dataIndex: 'content',
      key: 'content',
      render: (_: string, record: any) => {
        return record.content ? Translation.get(record.content) : record.content;
      }
    }
  ];
  if (identity?.role === 0 || identity?.role === 1) {
    columns.push({
      title: Translation.get('common.detail'),
      dataIndex: 'message',
      key: 'message',
      render: (text: string, record: any) => {
        return record.message ? Translation.get(record.message) : record.message;
      }
    });
  }
  columns.push({
    title: Translation.get('common.timestamp'),
    dataIndex: 'timestamp',
    key: 'timestamp',
    render: (timestamp: number) => Dayjs.format(timestamp)
  });
  return columns;
};
