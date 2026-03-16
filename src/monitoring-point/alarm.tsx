import * as React from 'react';
import { Button, Space, Spin, TableProps, Tag } from 'antd';
import { Translation } from 'locales/utils';
import { AlarmRule } from '../features/alarm/alarm-group/types';
import { translateMetricName } from '../features/alarm/alarm-group';
import {
  bindMeasurementsToAlarmRule,
  getAlarmRules,
  unbindMeasurementsToAlarmRule
} from '../features/alarm/alarm-group/services';
import { Table } from '../components';
import { AlarmLevelTag } from '../features/alarm';
import { MonitoringPointType } from 'common';
import { useMonitoringPointContext } from './provider';
import { MonitoringPointRow } from 'asset-common';

export const AlarmRuleSetting = ({ point }: { point: MonitoringPointRow }) => {
  const [rules, setRules] = React.useState<AlarmRule[]>();
  const [loading, setLoading] = React.useState(true);
  const { ruleGroups, refresh } = useMonitoringPointContext();

  const getRules = (dataSource: AlarmRule['rules']): TableProps<any> => {
    return {
      rowKey: 'id',
      columns: [
        { title: Translation.get('common.name'), dataIndex: 'name', key: 'name', width: 400 },
        {
          title: Translation.get('alarm.metric'),
          dataIndex: 'metric',
          key: 'metric',
          render: (metric: any) => translateMetricName(metric.name)
        },
        {
          title: Translation.get('alarm.trigger.condition'),
          dataIndex: 'condition',
          key: 'condition',
          render: (_: string, record: any) => {
            return `${record.operation} ${record.threshold} ${record.metric.unit}`;
          }
        },
        {
          title: Translation.get('alarm.level'),
          dataIndex: 'level',
          key: 'level',
          render: (level: number) => <AlarmLevelTag level={level} />
        }
      ],
      dataSource,
      pagination: false
    };
  };
  const columns = [
    {
      title: Translation.get('common.status'),
      dataIndex: 'bindedStatus',
      key: 'bindedStatus',
      render: (status: boolean) => (
        <Tag color={status ? 'green' : 'geekblue'}>
          {status ? Translation.get('common.binded') : Translation.get('common.unbinded')}
        </Tag>
      )
    },
    {
      title: Translation.get('common.name'),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: Translation.get('common.type'),
      dataIndex: 'type',
      key: 'type',
      render: (typeId: number) => {
        const label = MonitoringPointType.Key.getLabel(typeId);
        return label ? Translation.get(label) : '-';
      }
    },
    {
      title: Translation.get('common.operation'),
      key: 'action',
      render: (_: any, row: AlarmRule) => {
        return (
          <Space>
            {row.bindedStatus ? (
              <Button
                type='link'
                size='small'
                title={Translation.get('common.action.remove')}
                danger={true}
                onClick={() => {
                  updateRow(row.id, { bindingStatus: true });
                  unbindMeasurementsToAlarmRule(row.id, { monitoring_point_ids: [point.id] }).then(
                    () => {
                      updateRow(row.id, { bindedStatus: false, bindingStatus: false });
                      refresh();
                    }
                  );
                }}
              >
                {row.bindingStatus ? <Spin /> : Translation.get('common.action.remove')}
              </Button>
            ) : (
              <Button
                type='link'
                size='small'
                title={Translation.get('common.action.bind')}
                onClick={() => {
                  updateRow(row.id, { bindingStatus: true });
                  bindMeasurementsToAlarmRule(row.id, { monitoring_point_ids: [point.id] }).then(
                    () => {
                      updateRow(row.id, { bindedStatus: true, bindingStatus: false });
                      refresh();
                    }
                  );
                }}
              >
                {row.bindingStatus ? <Spin /> : Translation.get('common.action.bind')}
              </Button>
            )}
          </Space>
        );
      }
    }
  ];

  const updateRow = (id: number, data: {}) => {
    if (rules && rules.length > 0) {
      setRules(
        rules.map((rule) => {
          if (rule.id === id) {
            return { ...rule, ...data };
          } else {
            return rule;
          }
        })
      );
    }
  };

  const fetchAlarmRules = (type: number, bindeds: AlarmRule[]) => {
    getAlarmRules().then((data) => {
      setLoading(false);
      setRules(
        data
          .filter((rule) => rule.type === type)
          .map((rule) => ({ ...rule, bindedStatus: !!bindeds.find(({ id }) => id === rule.id) }))
      );
    });
  };

  React.useEffect(() => {
    fetchAlarmRules(point.type, ruleGroups);
  }, [point.type, ruleGroups]);

  return (
    <Table
      rowKey='id'
      cardProps={{ title: Translation.get('alarm.rules') }}
      columns={columns}
      dataSource={rules}
      expandable={{
        expandedRowRender: (record: AlarmRule) => (
          <Table {...getRules(record.rules)} noScroll={true} />
        )
      }}
      pagination={false}
      loading={loading}
    />
  );
};
