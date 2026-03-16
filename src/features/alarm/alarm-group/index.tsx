import * as React from 'react';
import { Button, message, Space, TableProps, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { ExportOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { getValue } from '../../../utils/format';
import { App, useAppType } from '../../../config';
import {
  DeleteIconButton,
  EditIconButton,
  Table,
  JsonImporter,
  IconButton
} from '../../../components';
import { AlarmLevelLightSelectFilter } from '../alarmLevelLightSelectFilter';
import { AlarmLevelTag } from '..';
import { CreateModal } from './createModal';
import { UpdateModal } from './updateModal';
import { BindMonitoringPoints } from './bindMonitoringPoints';
import { SelectRules } from './selectRules';
import { deleteAlarmRule, getAlarmRules, importAlarmRules } from './services';
import { AlarmRule } from './types';
import { useGlobalStyles } from '../../../styles';
import { CanAccess, Permission } from '../../../providers/access-control';
import { convertKeyFromServer, Translation } from 'locales/utils';

export default function AlarmRuleList() {
  const appType = useAppType();
  const [type, setType] = React.useState<string | undefined>();
  const [open, setOpen] = React.useState(false);
  const [levels, setLevels] = React.useState([1, 2, 3]);
  const [monitoringPointType, setMontoringPointType] = React.useState<number[]>([]);
  const { colorPrimaryHoverStyle } = useGlobalStyles();

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
      title: Translation.get('common.name'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => Translation.get(name)
    },
    {
      title: Translation.get('monitoring.point.type'),
      dataIndex: 'type',
      key: 'type',
      filters: App.getMonitoringPointTypes(appType).map(({ label, value }) => ({
        text: Translation.get(label),
        value
      })),
      render: (typeId: number) => {
        const label = App.getMonitoringPointTypes(appType).find((m) => m.value === typeId)?.label;
        return label ? Translation.get(label) : '-';
      }
    },
    {
      title: Translation.get('common.operation'),
      key: 'action',
      render: (_: string, row: AlarmRule) => {
        return (
          <Space>
            {row.editable && (
              <>
                <CanAccess {...Permission.AlarmRuleGroupEdit}>
                  <EditIconButton
                    onClick={() => {
                      setOpen(true);
                      setType('update');
                      setSelectedRow(row);
                    }}
                  />
                </CanAccess>
                <CanAccess {...Permission.AlarmRuleDelete}>
                  <DeleteIconButton
                    confirmProps={{
                      description: Translation.get('feedback.prompt.delete'),
                      onConfirm: () => {
                        deleteAlarmRule(row.id).then(() => {
                          fetchAlarmRules(levels, monitoringPointType);
                        });
                      }
                    }}
                  />
                </CanAccess>
              </>
            )}
            <CanAccess {...Permission.AlarmRuleGroupBind}>
              <IconButton
                icon={<MoreOutlined />}
                size='small'
                onClick={() => {
                  setType('bind');
                  setSelectedRow(row);
                  setOpen(true);
                }}
              />
            </CanAccess>
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
          title: Translation.get('common.name'),
          dataIndex: 'name',
          key: 'name',
          render: (name: string) => Translation.get(name)
        },
        {
          title: Translation.get('alarm.metric'),
          dataIndex: 'metric',
          key: 'metric',
          render: (metric: any) => {
            return translateMetricName(metric.name);
          }
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
      pagination: false,
      style: { marginLeft: 40, width: columns.length === 2 ? 'auto' : 770 }
    };
  };

  const [loading, setLoading] = React.useState(false);
  const [alarmRules, setAlarmRules] = React.useState<AlarmRule[]>([]);

  const fetchAlarmRules = (levels: number[], monitoringPointType: number[]) => {
    setLoading(true);
    getAlarmRules()
      .then((data) =>
        setAlarmRules(
          data
            .filter(({ rules }) => rules.some((r) => levels.includes(r.level)))
            .filter(({ type }) =>
              monitoringPointType.length > 0 ? monitoringPointType.includes(type) : true
            )
        )
      )
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    fetchAlarmRules(levels, monitoringPointType);
  }, [levels, monitoringPointType]);

  return (
    <Content>
      <Typography.Title level={4}>{Translation.get('alarm.rules')}</Typography.Title>
      <Table
        {...{
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

          pagination: false,
          loading,
          dataSource: alarmRules
        }}
        header={{
          toolbar: (
            <>
              <AlarmLevelLightSelectFilter onChange={setLevels} value={levels} />
              <Button.Group>
                <CanAccess {...Permission.AlarmRuleGroupAdd}>
                  <IconButton
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setOpen(true);
                      setType('create');
                    }}
                    tooltipProps={{ title: Translation.createSth('alarm.rules') }}
                    type='primary'
                  />
                </CanAccess>
                <CanAccess {...Permission.AlarmRuleGroupExport}>
                  {alarmRules.length > 0 && (
                    <IconButton
                      icon={<ExportOutlined />}
                      onClick={() => {
                        setOpen(true);
                        setType('export');
                      }}
                      tooltipProps={{
                        title: Translation.doSth('common.action.export', 'common.settings')
                      }}
                      type='primary'
                    />
                  )}
                </CanAccess>
                <CanAccess {...Permission.AlarmRuleGroupImport}>
                  <JsonImporter
                    iconButtonProps={{
                      style: {
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        borderInlineStartColor: colorPrimaryHoverStyle.color
                      }
                    }}
                    onUpload={(data) => {
                      return importAlarmRules(data).then((res) => {
                        if (res.data.code === 200) {
                          message.success(Translation.get('feedback.success.import'));
                          fetchAlarmRules(levels, monitoringPointType);
                        } else {
                          message.error(Translation.failureDo('common.action.import'));
                        }
                      });
                    }}
                  />
                </CanAccess>
              </Button.Group>
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
                <SelectRules {...modalProps} rules={alarmRules} onSuccess={() => setOpen(false)} />
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
          )
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
    </Content>
  );
}

export function translateMetricName(name: string) {
  if (!name) return name;
  if (name.indexOf(':')) {
    return name
      .split(':')
      .map((n) => Translation.get(convertKeyFromServer(n) as string))
      .join(':');
  } else {
    return Translation.get(name);
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
  const thres = getValue({ value: threshold, unit });
  const alarmValue = getValue({ value, unit });
  return `${translateMetricName(name)} ${operation} ${thres} ${Translation.get(
    'alarm.value'
  )}: ${alarmValue}`;
}
