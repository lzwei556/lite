import { AssetRow } from 'asset-common';
import { DownloadIconButton, IconButton, Table } from 'components';
import React from 'react';
import { useColumns } from './columns';
import { Permission, useCan } from 'providers/access-control';
import { AssetCategory } from 'common/asset-category';
import { Space } from 'antd';
import { ImportButton } from './import';
import { DownloadModal } from './download-modal';
import { ExportModal } from './export-modal';
import intl from 'react-intl-universal';
import { ExportOutlined, PlusOutlined } from '@ant-design/icons';
import { mapTree } from 'utils/tree';

export const FolderAssetsTable = ({
  assets,
  ...rest
}: {
  assets: AssetRow[];
  onDeleteSuccess: (id: number) => void;
  openCreate: () => void;
  openUpdate: (asset: AssetRow) => void;
  createFormModal: React.ReactNode;
  updateFormModal: React.ReactNode;
}) => {
  const canAdd = useCan(Permission.AssetAdd);
  const canEdit = useCan(Permission.AssetEdit);
  const [open, setOpen] = React.useState(false);
  const [action, setAction] = React.useState<'download' | 'export'>();
  const commonProps = {
    assets,
    open,
    onCancel: () => {
      setOpen(false);
      setAction(undefined);
    }
  };
  return (
    <>
      <Table
        columns={useColumns({ canEdit, ...rest })}
        dataSource={getDataSource(assets)}
        header={{
          toolbar: (
            <Space.Compact>
              <IconButton
                icon={<PlusOutlined />}
                onClick={rest.openCreate}
                tooltipProps={{
                  title: intl.get('CREATE_SOMETHING', { something: intl.get('ASSET') })
                }}
                type='primary'
              />
              <DownloadIconButton
                onClick={() => {
                  setOpen(true);
                  setAction('download');
                }}
                tooltipProps={{ title: intl.get('BATCH_DOWNLOAD') }}
                type='primary'
                variant='solid'
              />
              <IconButton
                icon={<ExportOutlined />}
                onClick={() => {
                  setOpen(true);
                  setAction('export');
                }}
                tooltipProps={{ title: intl.get('EXPORT_SETTINGS') }}
                type='primary'
              />
              <ImportButton onSuccess={() => console.log('success')} />
            </Space.Compact>
          )
        }}
        rowKey={(asset) => asset.id}
      />
      {canAdd && rest.createFormModal}
      {canEdit && rest.updateFormModal}
      {open && action === 'download' && <DownloadModal {...commonProps} />}
      {open && action === 'export' && (
        <ExportModal {...commonProps} onSuccess={() => console.log('success')} />
      )}
    </>
  );
};

const getDataSource = (assets: AssetRow[]) => {
  const dataSource: AssetRow[] = [];
  mapTree(assets, (asset) => {
    if (AssetCategory.Categories.getKeys(['folder']).includes(asset.type)) {
      dataSource.push({ ...asset, children: undefined });
    }
  });
  return dataSource;
};
