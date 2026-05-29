import {
  createActionState,
  ResourceTable,
  useDataFetch,
  useResourceList,
  useResourceQuery
} from 'resource';
import { Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Upload } from 'components';
import { deleteOne, Fields, getList, upload } from 'domain/firmware';
import { Permission, useCan } from 'providers/access-control';
import React from 'react';
import intl from 'react-intl-universal';

export default function Firmwares() {
  const query = useResourceQuery();
  const list = useResourceList(getList, query.query);
  const uploadState = createActionState(
    useDataFetch(upload, {
      manual: true,
      onSuccess: ({ messageInstance }) => {
        messageInstance?.success('upload.success');
        list.handleCreated(query.setQuery);
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
          api: { delete: deleteOne },
          actions: {
            upload: {
              can: useCan(Permission.FirmwareAdd),
              position: 'toolbar',
              render: () => <Upload {...uploadState} accept='.bin' />
            },
            delete: {
              can: useCan(Permission.FirmwareDelete),
              onSuccess: () => list.handleDeleted(query.setQuery)
            }
          }
        }}
        list={list}
        queryController={query}
      />
    </Content>
  );
}
