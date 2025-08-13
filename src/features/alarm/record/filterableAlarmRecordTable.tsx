import * as React from 'react';
import { Input, Space, Tag, Typography } from 'antd';
import intl from 'react-intl-universal';
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
import HasPermission from '../../../permission';
import { Permission } from '../../../permission/permission';
import { Store, useStore } from '../../../hooks/store';
import { pickOptionsFromNumericEnum } from '../../../utils';
import { App, useAppType } from '../../../config';
import { getAlarmDetail } from '../alarm-group';
import { MONITORING_POINT } from '../../../asset-common';
import { alarmLevelOptions, AlarmLevelTag } from '..';

enum Status {
  UnProcessd = 0,
  AutoProcessd = 2
}

export const FilterableAlarmRecordTable: React.FC<{
  sourceId?: number;
  storeKey?: 'alarmRecordList' | 'monitoringPointAlarmRecordList';
}> = ({ sourceId, storeKey = 'alarmRecordList' }) => {
  const [dataSource, setDataSource] = React.useState<PageResult<any[]>>();
  const [status, setStatus] = React.useState<Status[]>([]);
  const [store, setStore, gotoPage] = useStore(storeKey);
  const { numberedRange, setRange } = useRange();
  const statusOptions = pickOptionsFromNumericEnum(Status, 'alarm.record').map(
    ({ label, value }) => ({ text: intl.get(label), value })
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
      title: intl.get('ALARM_NAME'),
      dataIndex: 'alarmRuleGroupName',
      key: 'alarmRuleGroupName',
      render: (name: string, record: any) => {
        return record.alarmRuleGroupId === 0 ? '已删除' : name;
      }
    },
    {
      title: intl.get('ALARM_LEVEL'),
      dataIndex: 'level',
      key: 'level',
      filters: alarmLevelOptions.map((o) => ({ ...o, text: intl.get(o.label) })),
      render: (level: number) => <AlarmLevelTag level={level} />
    },
    {
      title: intl.get('ALARM_SOURCE'),
      dataIndex: 'source',
      key: 'source',
      render: (source: any) => {
        if (source) {
          return source.name;
        }
        return intl.get('UNKNOWN_SOURCE');
      }
    },
    {
      title: intl.get('ALARM_DETAIL'),
      dataIndex: 'metric',
      key: 'metric',
      render: (metric: any, record: any) => getAlarmDetail(record, metric)
    },
    {
      title: intl.get('ALARM_TIMESTAMP'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: number) => Dayjs.format(createdAt)
    },
    {
      title: intl.get('ALARM_DURATION'),
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
      title: intl.get('ALARM_STATUS'),
      dataIndex: 'status',
      key: 'status',
      filters: statusOptions,
      render: (status: Status) => {
        const text = statusOptions.find((option) => option.value === status)?.text;
        return <Tag color={status === Status.AutoProcessd ? 'success' : undefined}>{text}</Tag>;
      }
    },
    {
      title: intl.get('OPERATION'),
      key: 'action',
      render: (_: any, record: any) => {
        return (
          <Space>
            <HasPermission value={Permission.AlarmRecordDelete}>
              <DeleteIconButton
                confirmProps={{
                  description: intl.get('DELETE_ALARM_RECORD_PROMPT'),
                  onConfirm: () => onDelete(record.id)
                }}
              />
            </HasPermission>
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
              prefix={<Typography.Text type='secondary'>{intl.get('ALARM_NAME')}</Typography.Text>}
            />
            {!sourceId && (
              <LightSelectFilter
                maxTagCount={2}
                mode='multiple'
                onChange={setMontoringPointType}
                options={App.getMonitoringPointTypes(appType).map(({ label, id }) => ({
                  label: intl.get(label),
                  value: id
                }))}
                prefix={intl.get('OBJECT_TYPE', { object: intl.get(MONITORING_POINT) })}
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
