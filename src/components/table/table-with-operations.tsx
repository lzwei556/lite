import { UserAddOutlined } from '@ant-design/icons';
import { Space, TableProps } from 'antd';
import { Table } from './table';
import { DeleteIconButton, EditIconButton, IconButton } from 'components';
import React from 'react';
import intl from 'react-intl-universal';
import { BaseEntity, ListProps, useActionModal } from 'types/common';
import { transform } from 'types/page';

export const TableWithOperations = <T extends BaseEntity>({
  listProps,
  hideOperateionCell,
  ...rest
}: TableProps<T> & {
  listProps: ListProps<T>;
  hideOperateionCell?: (record: T) => boolean;
}) => {
  const { dataSource, actions } = listProps;
  const createAction = actions?.create;
  const updateAction = actions?.update;
  const deleteAction = actions?.delete;
  const { open, modalNode } = useActionModal(actions);
  

  const getColumns = () => {
    const columns = rest.columns ?? [];
    if (
      columns.length > 0 &&
      !columns.map((c) => c.key).includes('action') &&
      (updateAction?.can || deleteAction?.can)
    ) {
      columns.push({
        title: intl.get('OPERATION'),
        key: 'action',
        render: (_: string, record: T) => {
          return hideOperateionCell?.(record) ? null : (
            <Space>
              <EditIconButton onClick={() => open('update', record)} />
              <DeleteIconButton
                confirmProps={{
                  description: intl.get('DELETE_USER_PROMPT'),
                  onConfirm: () => deleteAction?.state?.submit({ id: record.id })
                }}
              />
            </Space>
          );
        }
      });
    }
    return columns;
  };

  const getDataSource = () => {
    if (dataSource) {
      if (Array.isArray(dataSource)) {
        return dataSource;
      } else {
        return transform(dataSource).list;
      }
    }
  };

  return (
    <>
      <Table
        columns={getColumns()}
        dataSource={getDataSource()}
        header={{
          toolbar: createAction?.can && (
            <>
              <IconButton
                icon={<UserAddOutlined />}
                onClick={() => open('create')}
                tooltipProps={{ title: intl.get('CREATE_USER') }}
                type='primary'
              />
              {/* {createAction?.modal?.({})} */}
            </>
          )
        }}
        pagination={false}
        rowKey={(row) => row.id}
        {...rest}
      />
      {modalNode}
    </>
  );
};
