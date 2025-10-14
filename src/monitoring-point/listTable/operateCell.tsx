import React from 'react';
import { Space } from 'antd';
import intl from 'react-intl-universal';
import { deleteMeasurement } from '../services';
import { MonitoringPointRow } from '../types';
import { DeleteIconButton, EditIconButton } from '../../components';
import { CanAccess, Permission } from '../../providers/access-control';

export const OperateCell = ({
  point,
  onDeleteSuccess,
  onUpdate
}: {
  point: MonitoringPointRow;
  onDeleteSuccess: (id: number) => void;
  onUpdate: (point: MonitoringPointRow) => void;
}) => {
  return (
    <Space>
      <CanAccess {...Permission.MeasurementEdit}>
        <EditIconButton onClick={() => onUpdate(point)} />
      </CanAccess>
      <CanAccess {...Permission.MeasurementDelete}>
        <DeleteIconButton
          confirmProps={{
            description: intl.get('DELETE_SOMETHING_PROMPT', { something: point.name }),
            onConfirm: () => deleteMeasurement(point.id).then(() => onDeleteSuccess(point.id))
          }}
        />
      </CanAccess>
    </Space>
  );
};
