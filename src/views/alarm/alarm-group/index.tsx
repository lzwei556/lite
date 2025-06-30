import * as React from 'react';
import { Button, Empty, message, Space, TableProps } from 'antd';
import { ExportOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import HasPermission from '../../../permission';
import { Permission } from '../../../permission/permission';
import { BindMonitoringPoints } from './bindMonitoringPoints';
import { SelectRules } from './selectRules';
import { deleteAlarmRule, getAlarmRules, importAlarmRules } from './services';
import { AlarmRule } from './types';
import { isMobile } from '../../../utils/deviceDetection';
import { getValue } from '../../../utils/format';
import { App, useAppType } from '../../../config';
import { MONITORING_POINT } from '../../asset-common';
import { DeleteIconButton, EditIconButton, Table, JsonImporter } from '../../../components';
import { CreateModal } from './createModal';
import { UpdateModal } from './updateModal';
import { AlarmLevelLightSelectFilter } from '../alarmLevelLightSelectFilter';
import { AlarmLevelTag } from '..';

export default function AlarmRuleList() {
  const appType = useAppType();
  const [type, setType] = React.useState<string | undefined>();
  const [open, setOpen] = React.useState(false);
  const [levels, setLevels] = React.useState([1, 2, 3]);
  const [monitoringPointType, setMontoringPointType] = React.useState<number[]>([]);

  const reset = () => {
    setOpen(false);
    setType(undefined);
    setSelectedRow(undefined);
  };

  const modalProps = {
    open,
    onCancel: reset
  };

  const [selectedRow, setSelectedRow] = React.useState<AlarmRule>();
  const columns = [
    {
      title: intl.get('NAME'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => intl.get(name).d(name)
    },
    {
      title: intl.get('OBJECT_TYPE', { object: intl.get(MONITORING_POINT) }),
      dataIndex: 'type',
      key: 'type',
      filters: App.getMonitoringPointTypes(appType).map(({ label, id }) => ({
        text: intl.get(label),
        value: id
      })),
      render: (typeId: number) => {
        const label = App.getMonitoringPointTypes(appType).find((m) => m.id === typeId)?.label;
        return label ? intl.get(label) : '-';
      }
    },
    {
      title: intl.get('OPERATION'),
      key: 'action',
      render: (x: any, row: AlarmRule) => {
        return (
          <Space>
            {row.editable && (
              <>
                <EditIconButton
                  onClick={() => {
                    setOpen(true);
                    setType('update');
                    setSelectedRow(row);
                  }}
                />
                <HasPermission value={Permission.AlarmRuleDelete}>
                  <DeleteIconButton
                    confirmProps={{
                      description: intl.get('DELETE_RULE_PROMPT'),
                      onConfirm: () => {
                        deleteAlarmRule(row.id).then(() => {
                          fetchAlarmRules(levels, monitoringPointType);
                        });
                      }
                    }}
                  />
                </HasPermission>
              </>
            )}
            <HasPermission value={Permission.AlarmRuleGroupBind}>
              <Button
                icon={<MoreOutlined />}
                size='small'
                onClick={() => {
                  setType('bind');
                  setSelectedRow(row);
                  setOpen(true);
                }}
              />
            </HasPermission>
          </Space>
        );
      }
    }
  ];

  const getRules = (dataSource: AlarmRule['rules']): TableProps<any> => {
    return {
      rowKey: 'id',
      columns: [
        {
          title: intl.get('NAME'),
          dataIndex: 'name',
          key: 'name',
          render: (name: string) => intl.get(name).d(name)
        },
        {
          title: intl.get('ALARM_METRIC'),
          dataIndex: 'metric',
          key: 'metric',
          render: (metric: any) => {
            return translateMetricName(metric.name);
          }
        },
        {
          title: intl.get('ALARM_CONDITION'),
          dataIndex: 'condition',
          key: 'condition',
          render: (_: any, record: any) => {
            return `${record.operation} ${record.threshold} ${record.metric.unit}`;
          }
        },
        {
          title: intl.get('ALARM_LEVEL'),
          dataIndex: 'level',
          key: 'level',
          render: (level: number) => <AlarmLevelTag level={level} />
        }
      ],
      dataSource,
      pagination: false,
      size: 'small',
      style: { marginLeft: 40, width: columns.length === 2 ? 'auto' : 770 },
      scroll: isMobile ? { x: 600 } : undefined
    };
  };

  const [result, setResult] = React.useState<TableProps<any>>({
    rowKey: 'id',
    columns,
    expandable: {
      expandedRowRender: (record: AlarmRule) => (
        <Table {...getRules(record.rules)} noScroll={true} />
      )
    },
    onChange: (paged, filters: any) => {
      setMontoringPointType(filters?.type ?? []);
    },
    size: 'small',
    pagination: false,
    loading: true,
    locale: {
      emptyText: (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={intl.get('NO_DATA_PROMPT')} />
      )
    },
    scroll: isMobile ? { x: 600 } : undefined
  });

  const fetchAlarmRules = (levels: number[], monitoringPointType: number[]) => {
    setResult((prev) => ({ ...prev, loading: true }));
    getAlarmRules().then((data) => {
      setResult((prev) => ({
        ...prev,
        loading: false,
        dataSource: data
          .filter(({ rules }) => rules.some((r) => levels.includes(r.level)))
          .filter(({ type }) =>
            monitoringPointType.length > 0 ? monitoringPointType.includes(type) : true
          )
      }));
    });
  };

  React.useEffect(() => {
    fetchAlarmRules(levels, monitoringPointType);
  }, [levels, monitoringPointType]);

  return (
    <>
      <Table
        {...result}
        header={{
          title: intl.get('ALARM_RULES'),
          toolbar: [
            <>
              <AlarmLevelLightSelectFilter onChange={setLevels} value={levels} />
              <HasPermission value={Permission.AlarmRuleGroupAdd}>
                <Button
                  type='primary'
                  onClick={() => {
                    setOpen(true);
                    setType('create');
                  }}
                >
                  {intl.get('CREATE_ALARM_RULE')}
                  <PlusOutlined />
                </Button>
              </HasPermission>
              <HasPermission value={Permission.AlarmRuleGroupExport}>
                {result.dataSource && result.dataSource.length > 0 && (
                  <Button
                    type='primary'
                    onClick={() => {
                      setOpen(true);
                      setType('export');
                    }}
                  >
                    {intl.get('EXPORT_SETTINGS')}
                    <ExportOutlined />
                  </Button>
                )}
              </HasPermission>
              <HasPermission value={Permission.AlarmRuleGroupImport}>
                <JsonImporter
                  onUpload={(data) => {
                    return importAlarmRules(data).then((res) => {
                      if (res.data.code === 200) {
                        message.success(intl.get('IMPORTED_SUCCESSFUL'));
                        fetchAlarmRules(levels, monitoringPointType);
                      } else {
                        message.error(
                          `${intl.get('FAILED_TO_IMPORT')}${intl.get(res.data.msg).d(res.data.msg)}`
                        );
                      }
                    });
                  }}
                />
              </HasPermission>
              {open && type === 'create' && (
                <CreateModal
                  {...modalProps}
                  onSuccess={() => {
                    reset();
                    fetchAlarmRules(levels, monitoringPointType);
                  }}
                />
              )}
              {open && type === 'export' && (
                <SelectRules
                  {...modalProps}
                  rules={result.dataSource as AlarmRule[]}
                  onSuccess={() => setOpen(false)}
                />
              )}
              {open && type === 'update' && selectedRow && (
                <UpdateModal
                  {...modalProps}
                  alarm={selectedRow}
                  onSuccess={() => {
                    reset();
                    fetchAlarmRules(levels, monitoringPointType);
                  }}
                />
              )}
            </>
          ]
        }}
      />
      {open && type === 'bind' && selectedRow && (
        <BindMonitoringPoints
          {...{
            ...modalProps,
            selectedRow,
            onSuccess: () => {
              reset();
              fetchAlarmRules(levels, monitoringPointType);
            }
          }}
        />
      )}
    </>
  );
}

export function translateMetricName(name: string) {
  if (!name) return name;
  if (name.indexOf(':')) {
    return name
      .split(':')
      .map((n) => intl.get(n))
      .join(':');
  } else {
    return intl.get(name);
  }
}

export function getAlarmDetail(
  record: { operation: string; threshold: number; value: number },
  metric: {
    name: string;

    unit: string;
    value: number;
  }
) {
  const { operation, threshold, value } = record;
  const { name, unit } = metric;
  const thres = getValue(threshold, unit);
  const alarmValue = getValue(value, unit);
  return `${translateMetricName(name)} ${operation} ${thres} ${intl.get(
    'ALARM_VALUE'
  )}: ${alarmValue}`;
}
