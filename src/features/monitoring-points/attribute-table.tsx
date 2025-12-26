import { PlusOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import { MonitoringPoint, MonitoringPointType } from 'common';
import { DeleteIconButton, EditIconButton, IconButton, Table } from 'components';
import { CanAccess, Permission, useCan } from 'providers/access-control';
import React from 'react';
import intl from 'react-intl-universal';
import { getOptionLabelByValue } from 'utils';
import { basicFieldColumns } from './columns';

export const AttributeTable = ({
  monitoringPoints,
  ...rest
}: {
  monitoringPoints: MonitoringPoint[];
  onDeleteSuccess: (id: number) => void;
  openCreate: () => void;
  openUpdate: (point: MonitoringPoint) => void;
  createFormModal: React.ReactNode;
  updateFormModal: React.ReactNode;
}) => {
  const canAddMonitoringPoint = useCan(Permission.MeasurementAdd);
  const canEdit = useCan(Permission.MeasurementEdit);
  const canDelete = useCan(Permission.MeasurementDelete);

  const getColumns = (canEdit: boolean) => {
    const attributeColumns = MonitoringPointType.Key.getAttributes(monitoringPoints[0].type).map(
      (attr) => {
        const { options } = attr;
        const common = {
          dataIndex: [`attributes`, attr.name],
          key: attr.name,
          title: () => intl.get(attr.label)
        };
        return options
          ? { ...common, render: (axis: string) => intl.get(getOptionLabelByValue(options, axis)) }
          : common;
      }
    );
    const columns = [...basicFieldColumns, ...attributeColumns];
    if (canEdit) {
      columns.push({
        key: 'action',
        dataIndex: 'action',
        title: () => intl.get('OPERATION'),
        render: (_: string, point: MonitoringPoint) => <OperateCell {...{ ...rest, point }} />
      });
    }
    return columns;
  };

  return (
    <Table
      rowKey={(record) => record.id}
      columns={getColumns(canEdit || canDelete)}
      cardProps={{
        extra: canAddMonitoringPoint && (
          <>
            <IconButton
              icon={<PlusOutlined />}
              onClick={rest.openCreate}
              color='primary'
              variant='outlined'
            />
            {rest.createFormModal}
          </>
        ),
        title: intl.get('monitoring.points')
      }}
      dataSource={monitoringPoints}
      pagination={false}
    />
  );
};

const OperateCell = ({
  point,
  onDeleteSuccess,
  openUpdate,
  updateFormModal
}: {
  point: MonitoringPoint;
} & Omit<Parameters<typeof AttributeTable>[0], 'monitoringPoints'>) => {
  return (
    <Space>
      <CanAccess {...Permission.MeasurementEdit}>
        <EditIconButton onClick={() => openUpdate(point)} />
        {updateFormModal}
      </CanAccess>
      <CanAccess {...Permission.MeasurementDelete}>
        <DeleteIconButton
          confirmProps={{
            description: intl.get('DELETE_SOMETHING_PROMPT', { something: point.name })
            // onConfirm: () => deleteMeasurement(point.id).then(() => onDeleteSuccess(point.id))
          }}
        />
      </CanAccess>
    </Space>
  );
};
