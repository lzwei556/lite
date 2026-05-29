import { Tag } from 'antd';
import { ResourceTable, useResourceList } from 'resource';
import { AlarmLevelTag, options } from 'domain/alarm-level';
import { deleteOne, getList, Status, options as statusOptions } from 'domain/alarm-record';
import { Permission, useCan } from 'providers/access-control';
import React from 'react';
import intl from 'react-intl-universal';

export const AlarmRecordsTable = () => {
  const list = useResourceList(getList);
  return (
    <ResourceTable
      actionController={{
        api: { delete: deleteOne },
        actions: {
          delete: { can: useCan(Permission.AlarmRecordDelete), onSuccess: list.handleDeleted }
        }
      }}
      columns={[
        {
          dataIndex: 'alarmName',
          title: intl.get('ALARM_NAME')
        },
        {
          dataIndex: 'level',
          filters: options.map((o) => ({ ...o, text: intl.get(o.label) })),
          render: (level: number) => <AlarmLevelTag level={level} />,
          title: intl.get('ALARM_LEVEL')
        },
        {
          dataIndex: 'sourceName',
          title: intl.get('ALARM_SOURCE')
        },
        {
          dataIndex: 'alarmDetail',
          title: intl.get('ALARM_DETAIL')
        },
        {
          dataIndex: 'createAtText',
          title: intl.get('ALARM_TIMESTAMP')
        },
        {
          dataIndex: 'durationText',
          title: intl.get('alarm_group.consecutive_count')
        },
        {
          dataIndex: 'alarmName',
          filters: statusOptions.map((o) => ({ ...o, text: intl.get(o.label) })),
          render: (status: number) => {
            const text = statusOptions.find((option) => option.value === status)?.label;
            return (
              <Tag color={status === Status.AutoProcessed ? 'success' : undefined}>
                {text ? intl.get(text) : ''}
              </Tag>
            );
          },
          title: intl.get('ALARM_STATUS')
        }
      ]}
      list={list}
    />
  );
};
