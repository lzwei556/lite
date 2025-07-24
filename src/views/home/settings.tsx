import React from 'react';
import { Button, message } from 'antd';
import { DownloadOutlined, ExportOutlined } from '@ant-design/icons';
import { cloneDeep } from 'lodash';
import intl from 'react-intl-universal';
import { Table, JsonImporter, Link } from '../../components';
import { getProject } from '../../utils/session';
import { App, useAppType } from '../../config';
import { ASSET_PATHNAME, AssetRow, importAssets, useContext } from '../asset-common';
import * as Area from '../asset-area';
import * as Wind from '../app-wind-turbine';
import { BatchDownlaodHistoryDataModal } from './batchDownlaodHistoryDataModal';
import { SelectAssets } from './selectAssets';
import { OperateCell } from './_operateCell';

export const Settings = () => {
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
        <>
          <Wind.ActionBar {...props} />
          <Area.ActionBar {...props} />
        </>
      );
    }
  };
  const dataSource = cloneDeep(assets);

  return (
    <>
      <Table
        bordered={true}
        columns={[
          {
            dataIndex: 'name',
            key: 'name',
            title: intl.get('NAME'),
            render: (_, row: AssetRow) => (
              <Link to={`/${ASSET_PATHNAME}/${row.id}-${row.type}`}>{row.name}</Link>
            )
          },
          {
            key: 'action',
            title: intl.get('OPERATION'),
            render: (_: string, asset: AssetRow) => <OperateCell asset={asset} />
          }
        ]}
        dataSource={dataSource.map((a) => {
          delete a.children;
          return a;
        })}
        header={{
          toolbar: [
            renderActionBar(),
            <Button
              onClick={() => {
                setOpen(true);
                setType('download');
              }}
              type='primary'
              title={intl.get('BATCH_DOWNLOAD')}
            >
              {intl.get('BATCH_DOWNLOAD')}
              <DownloadOutlined />
            </Button>,
            <Button
              onClick={() => {
                setOpen(true);
                setType('export');
              }}
              type='primary'
              title={intl.get('EXPORT_SETTINGS')}
            >
              {intl.get('EXPORT_SETTINGS')}
              <ExportOutlined />
            </Button>,
            <JsonImporter
              onUpload={(data) => {
                return importAssets(getProject().id, data).then((res) => {
                  if (res.data.code === 200) {
                    message.success(intl.get('IMPORTED_SUCCESSFUL'));
                    refresh();
                  } else {
                    message.error(`${intl.get('FAILED_TO_IMPORT')}: ${res.data.msg}`);
                  }
                });
              }}
            />
          ]
        }}
        rowKey={(row) => row.id}
      />
      {open && type === 'download' && <BatchDownlaodHistoryDataModal {...commonProps} />}
      {open && type === 'export' && <SelectAssets {...commonProps} onSuccess={refresh} />}
    </>
  );
};
