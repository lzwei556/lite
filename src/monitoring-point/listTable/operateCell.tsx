import React from 'react';
import { Space } from 'antd';
import intl from 'react-intl-universal';
import HasPermission from '../../permission';
import { Permission } from '../../permission/permission';
import { deleteMeasurement } from '../services';
import { MonitoringPointRow } from '../types';
import { DeleteIconButton, EditIconButton } from '../../components';

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
      <HasPermission value={Permission.MeasurementEdit}>
        <EditIconButton onClick={() => onUpdate(point)} />
      </HasPermission>
      <HasPermission value={Permission.MeasurementDelete}>
        <DeleteIconButton
          confirmProps={{
            description: intl.get('DELETE_SOMETHING_PROMPT', { something: point.name }),
            onConfirm: () => deleteMeasurement(point.id).then(() => onDeleteSuccess(point.id))
          }}
        />
      </HasPermission>
    </Space>
  );
};
