import { Col } from 'antd';
import { AssetRow } from 'asset-common';
import { Grid, TabsDetail } from 'components';
import React from 'react';
import intl from 'react-intl-universal';
import {
  useCreateFormProps,
  CreateFormModal,
  UpdateFolderAssetFormCard,
  UpdateFormModal,
  useUpdateFormProps
} from 'features/asset-settings';
import { AssetsArea } from './area/assets';
import { AssetsWindTurbine } from './wind-turbine/assets';
import { SettingsTableTabs } from 'features/asset-list';
import { Permission, useCan } from 'providers/access-control';
import { AssetNavigator } from 'features/asset-tree';
import { FolderAsset } from 'domain/asset';

export default function Index({ asset }: { asset: AssetRow }) {
  const updateFolderFormProps = useUpdateFormProps(asset.id);
  const [open, setOpen] = React.useState(false);
  const [editingAsset, setEditingAsset] = React.useState<AssetRow>();
  const commonModalProps = {
    parent: asset,
    editingAsset,
    afterClose: () => setEditingAsset(undefined),
    open,
    onCancel: () => setOpen(false),
    onSuccess: () => console.log('onSuccess')
  };
  const createFormProps = useCreateFormProps();
  const updatePrimaryAssetFormProps = useUpdateFormProps(editingAsset?.id);

  return (
    <TabsDetail
      items={[
        {
          label: intl.get('assets'),
          key: 'asset',
          content:
            FolderAsset.Enum.Area === asset.type ? (
              <AssetsArea asset={asset} key={asset.id} />
            ) : (
              <AssetsWindTurbine asset={asset} key={asset.id} />
            )
        },
        {
          label: intl.get('SETTINGS'),
          key: 'settings',
          content: (
            <Grid>
              <Col span={24}>
                <UpdateFolderAssetFormCard {...{ ...updateFolderFormProps, asset }} />
              </Col>
              <Col span={24}>
                <SettingsTableTabs
                  asset={asset}
                  createFormModal={
                    !editingAsset && (
                      <CreateFormModal {...{ ...commonModalProps, ...createFormProps }} />
                    )
                  }
                  canEdit={useCan(Permission.AssetEdit)}
                  updateFormModal={
                    editingAsset && (
                      <UpdateFormModal
                        {...{ ...commonModalProps, ...updatePrimaryAssetFormProps, editingAsset }}
                      />
                    )
                  }
                  openCreate={() => setOpen(true)}
                  openUpdate={(asset) => {
                    setOpen(true);
                    setEditingAsset(asset);
                  }}
                  onDeleteSuccess={(id) => console.log(id)}
                />
              </Col>
            </Grid>
          )
        }
      ]}
      title={<AssetNavigator asset={asset} />}
    />
  );
}
