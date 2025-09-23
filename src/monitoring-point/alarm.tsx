import * as React from 'react';
import { Button, Space, Spin, TableProps, Tag } from 'antd';
import intl from 'react-intl-universal';
import { AlarmRule } from '../features/alarm/alarm-group/types';
import { translateMetricName } from '../features/alarm/alarm-group';
import {
  bindMeasurementsToAlarmRule,
  getAlarmRules,
  unbindMeasurementsToAlarmRule
} from '../features/alarm/alarm-group/services';
import { MonitoringPointRow, Point, useMonitoringPointContext } from '../asset-common';
import { Table } from '../components';
import { AlarmLevelTag } from '../features/alarm';

export const AlarmRuleSetting = ({ point }: { point: MonitoringPointRow }) => {
  const [rules, setRules] = React.useState<AlarmRule[]>();
  const [loading, setLoading] = React.useState(true);
  const { ruleGroups, refresh } = useMonitoringPointContext();

  const getRules = (dataSource: AlarmRule['rules']): TableProps<any> => {
    return {
      rowKey: 'id',
      columns: [
        { title: intl.get('NAME'), dataIndex: 'name', key: 'name', width: 400 },
        {
          title: intl.get('ALARM_METRIC'),
          dataIndex: 'metric',
          key: 'metric',
          render: (metric: any) => translateMetricName(metric.name)
        },
        {
          title: intl.get('ALARM_CONDITION'),
          dataIndex: 'condition',
          key: 'condition',
          render: (_: string, record: any) => {
            return `${record.operation} ${record.threshold} ${record.metric.unit}`;
          }
        },
        {
          title: intl.get('ALAMR_LEVEL'),
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
      title: intl.get('STATUS'),
      dataIndex: 'bindedStatus',
      key: 'bindedStatus',
      render: (status: boolean) => (
        <Tag color={status ? 'green' : 'geekblue'}>
          {status ? intl.get('BOUND') : intl.get('UNBOUND')}
        </Tag>
      )
    },
    {
      title: intl.get('NAME'),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: intl.get('TYPE'),
      dataIndex: 'type',
      key: 'type',
      render: (typeId: number) => {
        const label = Point.getTypeLabel(typeId);
        return label ? intl.get(label) : '-';
      }
    },
    {
      title: intl.get('OPERATION'),
      key: 'action',
      render: (_: any, row: AlarmRule) => {
        return (
          <Space>
            {row.bindedStatus ? (
              <Button
                type='link'
                size='small'
                title={intl.get('REMOVE')}
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
                {row.bindingStatus ? <Spin /> : intl.get('REMOVE')}
              </Button>
            ) : (
              <Button
                type='link'
                size='small'
                title={intl.get('BIND')}
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
                {row.bindingStatus ? <Spin /> : intl.get('BIND')}
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
      cardProps={{ title: intl.get('ALARM_RULES') }}
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
