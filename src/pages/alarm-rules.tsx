import * as React from 'react';
import { Typography, Upload } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { ExportOutlined, MoreOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Table, IconButton } from 'components';
import { CreateModal } from 'features/alarm-rule-management/mutation/create-form-modal';
import { UpdateModal } from 'features/alarm-rule-management/mutation/update-form-modal';
import { BindMonitoringPoints } from 'features/alarm-rule-management/bind-monitoring-points-modal';
import { SelectRules } from 'features/alarm-rule-management/export-form-modal';
import {
  AlarmRule,
  create,
  update,
  deleteOne,
  upload,
  RuleFields,
  AlarmRuleGroupFields
} from 'domains/alarm-rule';
import { useAlarmRuleList } from 'features/alarm-rule-management/hooks';
import { createActionState, ResourceTable, useDataFetch, useResourceQuery } from 'resource';
import { Permission, useCan } from 'providers/access-control';
import { useAppConfig } from 'providers/app';
import { AlarmLevelSelect, AlarmLevelTag } from 'domains/alarm-level';

export default function AlarmRules() {
  const monitoringPointTypeOptions = useAppConfig().monitoringPointTypeOptions;

  const queryController = useResourceQuery<{
    levels: number[];
    monitoringPointType: number[];
  }>({
    defaultFilters: {
      levels: [1, 2, 3],
      monitoringPointType: []
    }
  });

  const { alarmRules, loading, refresh } = useAlarmRuleList({
    levels: queryController.query.filters.levels,
    monitoringPointType: queryController.query.filters.monitoringPointType
  });

  const uploadState = createActionState(
    useDataFetch(upload, {
      manual: true,
      onSuccess: ({ messageInstance }) => {
        messageInstance?.success('upload.success');
        refresh();
      }
    })
  );

  return (
    <Content>
      <Typography.Title level={4}>{intl.get('ALARM_RULES')}</Typography.Title>
      <ResourceTable
        columns={[
          AlarmRuleGroupFields.Name,
          {
            ...AlarmRuleGroupFields.Type,
            filters: monitoringPointTypeOptions.map((o) => ({ ...o, text: intl.get(o.label) })),
            filteredValue: queryController.query.filters.monitoringPointType ?? []
          }
        ].map((field) => ({
          dataIndex: field.name,
          title: field.label
        }))}
        expandable={{
          expandedRowRender: (record: AlarmRule) => (
            <Table
              columns={[
                RuleFields.Name,
                RuleFields.Metric,
                RuleFields.Condition,
                { ...RuleFields.Level, render: (level: number) => <AlarmLevelTag level={level} /> }
              ].map((field) => ({
                dataIndex: field.name,
                title: field.label
              }))}
              dataSource={record.rules}
              noScroll={true}
            />
          )
        }}
        list={{ data: alarmRules, loading }}
        actionController={{
          api: {
            create,
            update,
            delete: deleteOne
          },
          actions: {
            create: {
              can: useCan(Permission.AlarmRuleGroupAdd),
              modal: (ctx) => <CreateModal {...ctx} />,
              onSuccess: refresh
            },
            update: {
              can: useCan(Permission.AlarmRuleGroupEdit),
              modal: (ctx: any) => <UpdateModal {...ctx} />,
              onSuccess: refresh
            },
            delete: {
              can: useCan(Permission.AlarmRuleGroupDelete),
              onSuccess: refresh
            },
            bind: {
              can: useCan(Permission.AlarmRuleGroupBind),
              position: 'row',
              modal: (ctx) => <BindMonitoringPoints {...ctx} selectedRow={ctx.record} />,
              render: ({ open, record }) => (
                <IconButton
                  icon={<MoreOutlined />}
                  size='small'
                  onClick={() => open('bind', record)}
                />
              )
            },
            export: {
              can: useCan(Permission.AlarmRuleGroupDelete),
              position: 'toolbar',
              modal: (ctx) => <SelectRules {...ctx} rules={alarmRules} />,
              render: ({ open }) =>
                alarmRules.length > 0 ? (
                  <IconButton
                    icon={<ExportOutlined />}
                    onClick={() => open('export')}
                    tooltipProps={{ title: intl.get('EXPORT_SETTINGS') }}
                    type='primary'
                  />
                ) : null
            },
            import: {
              can: useCan(Permission.AlarmRuleGroupImport),
              position: 'toolbar',
              render: () => <Upload {...uploadState} accept='.json' />
            }
          }
        }}
        header={
          <AlarmLevelSelect
            onChange={(nextLevels) => queryController.patchFilters({ levels: nextLevels })}
            value={queryController.query.filters.levels}
          />
        }
      />
    </Content>
  );
}
