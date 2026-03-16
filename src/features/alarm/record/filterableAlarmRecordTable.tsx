import * as React from 'react';
import { Input, Space, Tag, Typography } from 'antd';
import { Translation } from 'locales/utils';
import { PageResult } from '../../../types/page';
import { Dayjs } from '../../../utils';
import {
  RangeDatePicker,
  useRange,
  LightSelectFilter,
  Table,
  transformPagedresult,
  DeleteIconButton
} from '../../../components';
import { PagingAlarmRecordRequest, RemoveAlarmRecordRequest } from '../../../apis/alarm';
import { Store, useStore } from '../../../hooks/store';
import { pickOptionsFromNumericEnum } from '../../../utils';
import { App, useAppType } from '../../../config';
import { getAlarmDetail } from '../alarm-group';
import { alarmLevelOptions, AlarmLevelTag } from '..';
import { CanAccess, Permission } from '../../../providers/access-control';

enum Status {
  Unprocessed = 0,
  'Auto-Processed' = 2
}

export const FilterableAlarmRecordTable: React.FC<{
  sourceId?: number;
  storeKey?: 'alarmRecordList' | 'monitoringPointAlarmRecordList';
}> = ({ sourceId, storeKey = 'alarmRecordList' }) => {
  const [dataSource, setDataSource] = React.useState<PageResult<any[]>>();
  const [status, setStatus] = React.useState<Status[]>([]);
  const [store, setStore, gotoPage] = useStore(storeKey);
  const { numberedRange, setRange } = useRange();
  const statusOptions = pickOptionsFromNumericEnum(Status, 'alarm.status').map(
    ({ label, value }) => ({ text: Translation.get(label), value })
  );
  const [alarmName, setAlarmName] = React.useState<string | undefined>();
  const appType = useAppType();
  const [monitoringPointType, setMontoringPointType] = React.useState<number[]>([]);

  const fetchAlarmRecords = (
    alarmName: string | undefined,
    monitoringPointType: number[],
    status: Status[],
    store: Store['alarmRecordList'],
    range: [number, number],
    sourceId?: number
  ) => {
    const {
      pagedOptions: { index, size },
      alertLevels
    } = store;
    const filters: any = {};
    if (alarmName) {
      filters.monitoring_point_name_like = alarmName;
    }
    if (monitoringPointType.length > 0) {
      filters.monitoring_point_types = monitoringPointType.join(',');
    }
    if (alertLevels.length > 0) {
      filters.levels = alertLevels.join(',');
    }
    if (status && status.length > 0) {
      filters.status = status.join(',');
    }
    if (range) {
      const [from, to] = range;
      PagingAlarmRecordRequest(index, size, from, to, filters, sourceId).then((res) => {
        setDataSource({
          page: res.page,
          size: res.size,
          total: res.total,
          result: res.result
            .sort((prev: any, next: any) => prev.alarmRuleGroupId - next.alarmRuleGroupId)
            .filter((r: any) => r.status !== 1)
        });
      });
    }
  };

  React.useEffect(() => {
    fetchAlarmRecords(alarmName, monitoringPointType, status, store, numberedRange, sourceId);
  }, [alarmName, monitoringPointType, status, sourceId, store, numberedRange]);

  const onDelete = (id: number) => {
    RemoveAlarmRecordRequest(id).then((_) => {
      if (dataSource) {
        const { size, page, total } = dataSource;
        gotoPage({ size, total, index: page }, 'prev');
      }
    });
  };

  const columns: any = [
    {
      title: Translation.get('alarm.name'),
      dataIndex: 'alarmRuleGroupName',
      key: 'alarmRuleGroupName',
      render: (name: string, record: any) => {
        return record.alarmRuleGroupId === 0 ? '已删除' : name;
      }
    },
    {
      title: Translation.get('alarm.level'),
      dataIndex: 'level',
      key: 'level',
      filters: alarmLevelOptions.map((o) => ({ ...o, text: Translation.get(o.label) })),
      render: (level: number) => <AlarmLevelTag level={level} />
    },
    {
      title: Translation.get('alarm.source'),
      dataIndex: 'source',
      key: 'source',
      render: (source: any) => {
        if (source) {
          return source.name;
        }
        return Translation.get('common.unknown');
      }
    },
    {
      title: Translation.get('alarm.detail'),
      dataIndex: 'metric',
      key: 'metric',
      render: (metric: any, record: any) => getAlarmDetail(record, metric)
    },
    {
      title: Translation.get('alarm.created-at'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: number) => Dayjs.format(createdAt)
    },
    {
      title: Translation.get('alarm.consecutive.count'),
      dataIndex: 'duration',
      key: 'duration',
      render: (_: any, record: any) => {
        switch (record.status) {
          case 1:
          case 2:
            return Dayjs.toDate(record.createdAt).from(Dayjs.toDate(record.updatedAt), true);
          default:
            return Dayjs.toDate(record.createdAt).fromNow(true);
        }
      }
    },
    {
      title: Translation.get('alarm.status'),
      dataIndex: 'status',
      key: 'status',
      filters: statusOptions,
      render: (status: Status) => {
        const text = statusOptions.find((option) => option.value === status)?.text;
        return (
          <Tag color={status === Status['Auto-Processed'] ? 'success' : undefined}>{text}</Tag>
        );
      }
    },
    {
      title: Translation.get('common.operation'),
      key: 'action',
      render: (_: any, record: any) => {
        return (
          <Space>
            <CanAccess {...Permission.AlarmRecordDelete}>
              <DeleteIconButton
                confirmProps={{
                  description: Translation.get('feedback.prompt.delete'),
                  onConfirm: () => onDelete(record.id)
                }}
              />
            </CanAccess>
          </Space>
        );
      }
    }
  ];

  const { paged, ds } = transformPagedresult(dataSource);

  return (
    <Table
      columns={columns}
      dataSource={ds}
      onChange={(paged, filters) => {
        const _filters = filters as { level: number[]; status: Status[] };
        setStore((prev) => ({ ...prev, alertLevels: _filters?.level ?? [] }));
        setStatus(_filters?.status ?? []);
      }}
      header={{
        toolbar: (
          <>
            <Input
              onBlur={(e) => setAlarmName(e.target.value)}
              prefix={
                <Typography.Text type='secondary'>{Translation.get('alarm.name')}</Typography.Text>
              }
            />
            {!sourceId && (
              <LightSelectFilter
                maxTagCount={2}
                mode='multiple'
                onChange={setMontoringPointType}
                options={App.getMonitoringPointTypes(appType).map(({ label, value }) => ({
                  label: Translation.get(label),
                  value
                }))}
                prefix={Translation.get('monitoring.point.type')}
              />
            )}
            <RangeDatePicker onChange={setRange} />
          </>
        )
      }}
      pagination={{
        ...paged,
        onChange: (index, size) => setStore((prev) => ({ ...prev, pagedOptions: { index, size } }))
      }}
      rowKey={(row) => row.id}
    />
  );
};
