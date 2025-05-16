import React from 'react';
import { Button, Popconfirm, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import HasPermission from '../../../../permission';
import { Permission } from '../../../../permission/permission';
import { MONITORING_POINT } from '../constants';
import { deleteMeasurement } from '../services';
import { MonitoringPointRow } from '../types';

export const OperateCell = ({
  point,
  onDeleteSuccess,
  onUpdate
}: {
  point: MonitoringPointRow;
  onDeleteSuccess: () => void;
  onUpdate: (point: MonitoringPointRow) => void;
}) => {
  return (
    <Space>
      <HasPermission value={Permission.MeasurementEdit}>
        <Button
          type='text'
          size='small'
          title={intl.get('EDIT_SOMETHING', { something: intl.get(MONITORING_POINT) })}
          onClick={() => onUpdate(point)}
        >
          <EditOutlined />
        </Button>
      </HasPermission>
      <HasPermission value={Permission.MeasurementDelete}>
        <Popconfirm
          title={intl.get('DELETE_SOMETHING_PROMPT', { something: point.name })}
          onConfirm={() => {
            deleteMeasurement(point.id).then(onDeleteSuccess);
          }}
        >
          <Button
            type='text'
            danger={true}
            size='small'
            title={intl.get('DELETE_SOMETHING', { something: intl.get(MONITORING_POINT) })}
          >
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </HasPermission>
    </Space>
  );
};
