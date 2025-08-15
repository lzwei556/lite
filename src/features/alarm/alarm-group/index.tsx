import * as React from 'react';
import { Button, message, Space, TableProps, theme, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { ExportOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import HasPermission from '../../../permission';
import { Permission } from '../../../permission/permission';
import { isMobile } from '../../../utils/deviceDetection';
import { getValue } from '../../../utils/format';
import { App, useAppType } from '../../../config';
import { MONITORING_POINT } from '../../../asset-common';
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
              <IconButton
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
      style: { marginLeft: 40, width: columns.length === 2 ? 'auto' : 770 },
      scroll: isMobile ? { x: 600 } : undefined
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
      <Typography.Title level={4}>{intl.get('ALARM_RULES')}</Typography.Title>
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
          dataSource: alarmRules,
          scroll: isMobile ? { x: 600 } : undefined
        }}
        header={{
          toolbar: (
            <>
              <AlarmLevelLightSelectFilter onChange={setLevels} value={levels} />
              <Button.Group>
                <HasPermission value={Permission.AlarmRuleGroupAdd}>
                  <IconButton
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setOpen(true);
                      setType('create');
                    }}
                    tooltipProps={{ title: intl.get('CREATE_ALARM_RULE') }}
                    type='primary'
                  />
                </HasPermission>
                <HasPermission value={Permission.AlarmRuleGroupExport}>
                  {alarmRules.length > 0 && (
                    <IconButton
                      icon={<ExportOutlined />}
                      onClick={() => {
                        setOpen(true);
                        setType('export');
                      }}
                      tooltipProps={{ title: intl.get('EXPORT_SETTINGS') }}
                      type='primary'
                    />
                  )}
                </HasPermission>
                <HasPermission value={Permission.AlarmRuleGroupImport}>
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
                          message.success(intl.get('IMPORTED_SUCCESSFUL'));
                          fetchAlarmRules(levels, monitoringPointType);
                        } else {
                          message.error(
                            `${intl.get('FAILED_TO_IMPORT')}${intl
                              .get(res.data.msg)
                              .d(res.data.msg)}`
                          );
                        }
                      });
                    }}
                  />
                </HasPermission>
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
  const thres = getValue({ value: threshold, unit });
  const alarmValue = getValue({ value, unit });
  return `${translateMetricName(name)} ${operation} ${thres} ${intl.get(
    'ALARM_VALUE'
  )}: ${alarmValue}`;
}
