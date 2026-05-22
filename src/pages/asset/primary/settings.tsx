import { Col } from 'antd';
import { AssetRow } from 'asset-common';
import { Grid } from 'components';
import React from 'react';
import { generateColProps } from 'utils/grid';
import { UpdateFormCard, useUpdateFormProps } from 'features/asset-settings';
import { AttributeTable } from 'features/monitoring-points';
import {
  CreateFormModal,
  UpdateFormModal,
  useCreateFormProps as useCreateMonitoringPointFormProps,
  useUpdateFormProps as useUpdateMonitoringPointFormProps
} from 'features/monitoring-point-settings';
import { ModalFormProps } from 'types/common';
import { PrimaryAsset } from 'domain/asset';
import { useAssetsContext } from 'providers/assets';
import * as MonitoringPoint from 'domain/monitoring-point';

export const Settings = ({ editingAsset }: { editingAsset: AssetRow }) => {
  const settings = PrimaryAsset.getSettings(editingAsset.type);
  const { refresh } = useAssetsContext();
  const updateFormProps = useUpdateFormProps(editingAsset.id, refresh);

  if (settings.length > 0) {
    return (
      <Grid>
        <Col {...generateColProps({ xl: 8, xxl: 8 })}>
          <UpdateFormCard {...{ ...updateFormProps, editingAsset }} />
        </Col>
        <Col {...generateColProps({ xl: 16, xxl: 16 })}>
          <MonitoringPointsManagement asset={editingAsset} refresh={refresh} />
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
          <MonitoringPointsManagement asset={editingAsset} refresh={refresh} />
        </Col>
      </Grid>
    );
  }
};

const MonitoringPointsManagement = ({
  asset,
  refresh
}: {
  asset: AssetRow;
  refresh: () => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const monitoringPoints = asset.monitoringPoints ?? [];
  const [point, setPoint] = React.useState<MonitoringPoint.Types.Entity>();
  const commonModalProps = {
    afterClose: () => setPoint(undefined),
    asset,
    open,
    onCancel: () => setOpen(false),
    point,
    onSuccess: () => {
      setOpen(false);
      refresh();
    }
  };
  const createFormProps = useCreateMonitoringPointFormProps(commonModalProps.onSuccess);

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
      onDeleteSuccess={() => refresh()}
    />
  );
};

const UpdateFormModalWrapper = ({
  point,
  ...rest
}: { point: MonitoringPoint.Types.Entity } & ModalFormProps) => {
  const updateFormProps = useUpdateMonitoringPointFormProps(point);
  return <UpdateFormModal {...{ ...rest, ...updateFormProps }} />;
};
