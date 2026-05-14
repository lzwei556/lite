import { Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { createActionState } from 'common/action';
import { ResourceTable, Upload } from 'components';
import { deleteOne, Fields, getList, upload } from 'domain/firmware';
import { useDataFetch, usePaginationList } from 'hooks/data';
import React from 'react';
import intl from 'react-intl-universal';

export default function Firmwares() {
  const list = usePaginationList(getList);
  const uploadState = createActionState(
    useDataFetch(upload, {
      onSuccess: ({ messageInstance }) => {
        list.refresh();
        messageInstance?.success('upload.success');
      }
    })
  );

  return (
    <Content>
      <Typography.Title level={4}>{intl.get('MENU_FIRMWARE_LIST')}</Typography.Title>
      <ResourceTable
        columns={Object.values(Fields).map((field) => ({
          dataIndex: field.name,
          title: intl.get(field.label)
        }))}
        actionController={{
          list,
          api: { delete: deleteOne },
          actions: {
            upload: {
              position: 'toolbar',
              render: () => <Upload {...uploadState} accept='.bin' />
            }
          }
        }}
        pagination={list.pagination}
      />
    </Content>
  );
}
