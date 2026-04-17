import { UserAddOutlined } from '@ant-design/icons';
import { Space, TableProps } from 'antd';
import { Table, transformPagedresult } from './table';
import { DeleteIconButton, EditIconButton, IconButton } from 'components';
import React from 'react';
import intl from 'react-intl-universal';
import { ListProps } from 'types/common';
import { useSearchParams } from 'react-router-dom';

export const TableWithOperations = <T extends { id: number }>({
  listProps,
  ...rest
}: TableProps<T> & { listProps: ListProps<T> }) => {
  const [, setUrlState] = useSearchParams();
  const {
    dataSource,
    fetch,
    canCreate,
    canUpdate,
    canDelete,
    createFormModal,
    updateFormModal,
    openCreate,
    openUpdate,
    onDelete
  } = listProps;
  const getColumns = () => {
    const columns = rest.columns ?? [];
    if (columns.length > 0 && (canUpdate || canDelete)) {
      columns.push({
        title: intl.get('OPERATION'),
        key: 'action',
        render: (_: string, record: T) => {
          return (
            <Space>
              <EditIconButton onClick={() => openUpdate(record)} />
              <DeleteIconButton
                confirmProps={{
                  description: intl.get('DELETE_USER_PROMPT'),
                  onConfirm: () => onDelete(record.id)
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
        return transformPagedresult(dataSource).ds;
      }
    }
  };

  const getPagination = () => {
    if (dataSource && !Array.isArray(dataSource)) {
      return {
        ...transformPagedresult(dataSource).paged,
        onChange: (page, size) => {
          fetch?.({ page, size });
          setUrlState({ page: `${page}`, size: `${size}` });
        }
      } as TableProps['pagination'];
    }
  };

  return (
    <>
      <Table
        {...rest}
        cardProps={{
          extra: canCreate && (
            <>
              <IconButton
                icon={<UserAddOutlined />}
                onClick={openCreate}
                tooltipProps={{ title: intl.get('CREATE_USER') }}
                type='primary'
              />
              {createFormModal}
            </>
          )
        }}
        columns={getColumns()}
        dataSource={getDataSource()}
        pagination={getPagination() && { ...rest.pagination, ...getPagination() }}
        rowKey={(row) => row.id}
      />
      {canUpdate && updateFormModal}
    </>
  );
};
