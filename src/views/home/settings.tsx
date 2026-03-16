import React from 'react';
import { Button, message } from 'antd';
import { ExportOutlined, PlusOutlined } from '@ant-design/icons';
import { cloneDeep } from 'lodash';
import { Translation } from 'locales/utils';
import { Table, JsonImporter, Link, DownloadIconButton, IconButton } from '../../components';
import { App, useAppType } from '../../config';
import { ASSET_PATHNAME, AssetRow, importAssets, useContext } from '../../asset-common';
import * as Area from '../../features/asset-area';
import * as Wind from '../../features/asset-wind-turbine';
import { BatchDownlaodHistoryDataModal } from './batchDownlaodHistoryDataModal';
import { SelectAssets } from './selectAssets';
import { OperateCell } from './_operateCell';
import { CreateAsset } from './create-asset';
import { useGlobalStyles } from '../../styles';
import { useSelectedProject } from '../../providers/user-profile';
import { CanAccess, Permission, useCan } from '../../providers/access-control';

export const Settings = () => {
  const { colorPrimaryHoverStyle } = useGlobalStyles();
  const selectedProject = useSelectedProject();
  const { assets, refresh } = useContext();
  const appType = useAppType();
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState<string | undefined>();
  const commonProps = {
    assets,
    open,
    onCancel: () => {
      setOpen(false);
      setType(undefined);
    }
  };

  const renderActionBar = () => {
    const props = { onSuccess: refresh, short: true };
    if (App.isWindLike(appType)) {
      return <Wind.ActionBar {...props} />;
    } else if (
      appType === 'corrosion' ||
      appType === 'corrosionWirelessHART' ||
      appType === 'vibration'
    ) {
      return <Area.ActionBar {...props} />;
    } else {
      return (
        <IconButton
          icon={<PlusOutlined />}
          onClick={() => {
            setOpen(true);
            setType('asset');
          }}
          tooltipProps={{ title: Translation.createSth('asset') }}
          type='primary'
        />
      );
    }
  };
  const dataSource = cloneDeep(assets);
  const canCreateAsset = useCan(Permission.AssetAdd);

  return (
    <>
      <Table
        bordered={true}
        columns={[
          {
            dataIndex: 'name',
            key: 'name',
            title: Translation.get('common.name'),
            render: (_, row: AssetRow) => (
              <Link to={`/${ASSET_PATHNAME}/${row.id}-${row.type}`}>{row.name}</Link>
            )
          },
          {
            key: 'action',
            title: Translation.get('common.operation'),
            render: (_: string, asset: AssetRow) => <OperateCell asset={asset} />
          }
        ]}
        dataSource={dataSource.map((a) => {
          delete a.children;
          return a;
        })}
        header={{
          toolbar: (
            <Button.Group>
              {canCreateAsset && renderActionBar()}
              <DownloadIconButton
                onClick={() => {
                  setOpen(true);
                  setType('download');
                }}
                tooltipProps={{ title: Translation.get('common.action.download') }}
                type='primary'
                variant='solid'
              />
              <IconButton
                icon={<ExportOutlined />}
                onClick={() => {
                  setOpen(true);
                  setType('export');
                }}
                tooltipProps={{
                  title: Translation.doSth('common.action.export', 'common.settings')
                }}
                type='primary'
              />
              {selectedProject && (
                <CanAccess {...Permission.AssetImport}>
                  <JsonImporter
                    iconButtonProps={{
                      style: {
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        borderInlineStartColor: colorPrimaryHoverStyle.color
                      }
                    }}
                    onUpload={(data) => {
                      return importAssets(selectedProject.id, data).then((res) => {
                        if (res.data.code === 200) {
                          message.success(Translation.get('feedback.success.import'));
                          refresh();
                        } else {
                          message.error(Translation.failureDo('common.action.import'));
                        }
                      });
                    }}
                  />
                </CanAccess>
              )}
            </Button.Group>
          )
        }}
        rowKey={(row) => row.id}
      />
      {open && type === 'download' && <BatchDownlaodHistoryDataModal {...commonProps} />}
      {open && type === 'export' && <SelectAssets {...commonProps} onSuccess={refresh} />}
      {open && type === 'asset' && (
        <CreateAsset
          {...commonProps}
          onSuccess={() => {
            refresh();
            setOpen(false);
            setType(undefined);
          }}
        />
      )}
    </>
  );
};
