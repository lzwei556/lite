import { TabsDetail } from 'components';
import React from 'react';
import intl from 'react-intl-universal';
import { ENV } from 'utils/env';
import { Overview } from './overview';
import { OverviewLegacy } from './overview-legacy';
import { FolderAssetsTable } from 'features/asset-list';
import { AssetRow } from 'asset-common';
import {
  CreateFolderAssetFormModal,
  UpdateFolderAssetFormModal,
  useCreateFormProps,
  useUpdateFormProps
} from 'features/asset-settings';
import { generateColProps } from 'utils/grid';
import { useAssetsContext } from 'providers/assets';
import { Hooks } from 'domain/asset';

export default function Index() {
  const isLegacy = ENV.legacyEnabled === 'true';
  const { assets, refresh } = useAssetsContext();
  const [open, setOpen] = React.useState(false);
  const [editingAsset, setEditingAsset] = React.useState<AssetRow>();
  const commonModalProps = {
    afterClose: () => setEditingAsset(undefined),
    open,
    onCancel: () => setOpen(false),
    editingAsset,
    onSuccess: () => console.log('onSuccess')
  };
  const createFormProps = useCreateFormProps();
  const updateFolderFormProps = useUpdateFormProps(editingAsset?.id);

  return (
    <TabsDetail
      items={[
        {
          label: intl.get('OVERVIEW'),
          key: 'overview',
          content: isLegacy ? <OverviewLegacy /> : <Overview />
        },
        {
          label: intl.get('SETTINGS'),
          key: 'settings',
          content: (
            <FolderAssetsTable
              assets={assets}
              createFormModal={
                !editingAsset && (
                  <CreateFolderAssetFormModal {...{ ...commonModalProps, ...createFormProps }} />
                )
              }
              updateFormModal={
                editingAsset && (
                  <UpdateFolderAssetFormModal
                    {...{
                      ...commonModalProps,
                      ...updateFolderFormProps,
                      editingAsset,
                      formItemColProps: generateColProps({}),
                      width: 480
                    }}
                  />
                )
              }
              openCreate={() => setOpen(true)}
              openUpdate={(asset) => {
                setOpen(true);
                setEditingAsset(asset);
              }}
              onDeleteSuccess={(id) => console.log('id')}
            />
          )
        }
      ]}
      title={Hooks.useVirturalAsset().root.name}
    />
  );
}
