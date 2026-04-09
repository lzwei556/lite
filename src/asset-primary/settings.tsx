import { Col } from 'antd';
import { AssetRow, MonitoringPointRow } from 'asset-common';
import { Grid } from 'components';
import React from 'react';
import { generateColProps } from 'utils/grid';
import { UpdateFormCard, useUpdateFormProps } from 'features/asset-settings';
import { AttributeTable } from 'features/monitoring-points/attribute-table';
import {
  CreateFormModal,
  UpdateFormModal,
  useCreateFormProps as useCreateMonitoringPointFormProps,
  useUpdateFormProps as useUpdateMonitoringPointFormProps
} from 'features/monitoring-point-settings';
import { ModalFormProps } from 'types/common';
import { PrimaryAsset } from 'domain/asset';

export const Settings = ({ editingAsset }: { editingAsset: AssetRow }) => {
  const settings = PrimaryAsset.getSettings(editingAsset.type);
  const updateFormProps = useUpdateFormProps(editingAsset.id);

  if (settings.length > 0) {
    return (
      <Grid>
        <Col {...generateColProps({ xl: 8, xxl: 8 })}>
          <UpdateFormCard {...{ ...updateFormProps, editingAsset }} />
        </Col>
        <Col {...generateColProps({ xl: 16, xxl: 16 })}>
          <MonitoringPointsManagement asset={editingAsset} />
        </Col>
      </Grid>
    );
  } else {
    return (
      <Grid>
        <Col span={24}>
          <UpdateFormCard
            {...{ ...updateFormProps, editingAsset }}
            formItemColProps={generateColProps({ xl: 12, xxl: 8 })}
          />
        </Col>
        <Col span={24}>
          <MonitoringPointsManagement asset={editingAsset} />
        </Col>
      </Grid>
    );
  }
};

const MonitoringPointsManagement = ({ asset }: { asset: AssetRow }) => {
  const [open, setOpen] = React.useState(false);
  const monitoringPoints = asset.monitoringPoints ?? [];
  const [point, setPoint] = React.useState<MonitoringPointRow>();
  const commonModalProps = {
    afterClose: () => setPoint(undefined),
    assetId: asset.id,
    open,
    onCancel: () => setOpen(false),
    point,
    onSuccess: () => console.log('onSuccess')
  };
  const createFormProps = useCreateMonitoringPointFormProps();

  return (
    <AttributeTable
      createFormModal={
        !point && <CreateFormModal {...{ ...commonModalProps, ...createFormProps }} />
      }
      updateFormModal={point && <UpdateFormModalWrapper {...{ ...commonModalProps, point }} />}
      openCreate={() => setOpen(true)}
      openUpdate={(point) => {
        setOpen(true);
        setPoint(point);
      }}
      monitoringPoints={monitoringPoints}
    />
  );
};

const UpdateFormModalWrapper = ({
  point,
  ...rest
}: { point: MonitoringPointRow } & ModalFormProps) => {
  const updateFormProps = useUpdateMonitoringPointFormProps(point);
  return <UpdateFormModal {...{ ...rest, ...updateFormProps }} />;
};
