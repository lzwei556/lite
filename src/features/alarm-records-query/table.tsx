import { Tag } from 'antd';
import { ResourceTable, useResourceList, useResourceQuery } from 'resource';
import { AlarmLevelTag, options } from 'domain/alarm-level';
import {
  querySchema,
  deleteOne,
  getList,
  Status,
  options as statusOptions
} from 'domain/alarm-record';
import { Permission, useCan } from 'providers/access-control';
import React from 'react';
import intl from 'react-intl-universal';
import { Filters } from './filters';
import { Dayjs } from 'utils';

export const AlarmRecordsTable = () => {
  const query = useResourceQuery({
    schema: querySchema,
    defaultFilters: { createAt: Dayjs.toRange(Dayjs.CommonRange.PastMonth) }
  });
  const list = useResourceList(getList, query.query);

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
          dataIndex: 'level',
          filters: options.map((o) => ({ ...o, text: intl.get(o.label) })),
          filteredValue: query.query.filters.level ?? [],
          render: (level: number) => <AlarmLevelTag level={level} />,
          title: intl.get('ALARM_LEVEL'),
          width: 150
        },
        {
          dataIndex: 'alarmDetail',
          render: (text: string) => <div style={{ minWidth: 200 }}>{text}</div>,
          title: intl.get('ALARM_DETAIL')
        },
        {
          dataIndex: 'alarmName',
          title: intl.get('ALARM_NAME'),
          width: 200
        },
        {
          dataIndex: 'sourceName',
          title: intl.get('ALARM_SOURCE'),
          width: 200
        },

        {
          dataIndex: 'createAtText',
          title: intl.get('ALARM_TIMESTAMP'),
          width: 180
        },
        {
          dataIndex: 'durationText',
          title: intl.get('alarm_group.consecutive_count'),
          width: 150
        },
        {
          dataIndex: 'status',
          filters: statusOptions.map((o) => ({ ...o, text: intl.get(o.label) })),
          filteredValue: query.query.filters.status ?? [],
          render: (status: number) => {
            const text = statusOptions.find((option) => option.value === status)?.label;
            return (
              <Tag color={status === Status.AutoProcessed ? 'success' : undefined}>
                {text ? intl.get(text) : ''}
              </Tag>
            );
          },
          title: intl.get('ALARM_STATUS'),
          width: 160
        }
      ]}
      header={
        <Filters
          nameFilter={{
            onChange: (name) => query.patchFilters({ name }),
            value: query.query.filters.name
          }}
          rangeFilter={{
            onChange: (createAt) => query.patchFilters({ createAt }),
            value: query.query.filters.createAt
          }}
          typesFilter={{
            enabled: true,
            onChange: (types) => query.patchFilters({ types }),
            value: query.query.filters.types
          }}
        />
      }
      list={list}
      queryController={query}
    />
  );
};
