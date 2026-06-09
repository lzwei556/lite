import { Space, TableProps } from 'antd';
import React from 'react';
import intl from 'react-intl-universal';
import { PageResult, transform } from 'types/page';
import { BaseEntity } from './types';
import { ActionControllerOptions, useActionController } from './action/controller';
import { Table } from 'components';
import { ActionButton } from './action/button';
import { ResourceQuery } from './use-query';

export const ResourceTable = <T extends BaseEntity>({
  actionController,
  columns,
  header,
  list,
  queryController,
  ...rest
}: TableProps<T> & {
  header?: React.ReactNode;
  list: {
    data?: T[] | PageResult<T>;
    loading?: boolean;
    total?: number;
  };
  actionController: ActionControllerOptions<T>;
  queryController?: {
    query: ResourceQuery;
    patchFilters: (filters: any) => void;
    setSorter: (sorter: any) => void;
    setPagination: (page: number, pageSize: number) => void;
  };
}) => {
  const { data, loading } = list;
  const { actions, open, modalNode } = useActionController(actionController);

  const toolbarActions = React.useMemo(() => {
    return Object.entries(actions ?? {}).filter(([_, action]) => {
      if (action.can === false) {
        return false;
      } else if (action.hidden) {
        return false;
      }

      return action.position === 'toolbar';
    });
  }, [actions]);

  const rowActions = React.useMemo(() => {
    return Object.entries(actions ?? {})
      .filter(([_, action]) => {
        if (action.can === false) {
          return false;
        }

        return action.position !== 'toolbar';
      })
      .sort(([, prev], [, next]) => (prev.sort ?? 1) - (next.sort ?? 1));
  }, [actions]);

  // 👉 行操作列
  const actionColumn = React.useMemo(() => {
    if (rowActions.length === 0) return null;

    return {
      title: intl.get('OPERATION'),
      key: '__actions',
      render: (_: any, record: T) => {
        return (
          <Space>
            {rowActions.map(([key, action]) => (
              <ActionButton
                key={key}
                actionKey={key}
                action={action}
                open={open}
                record={record}
                hidden={(record) => typeof action.hidden === 'function' && action.hidden?.(record)}
              />
            ))}
          </Space>
        );
      }
    };
  }, [rowActions, open]);

  const mergedColumns = React.useMemo(() => {
    if (!actionColumn) return columns;
    return [...(columns || []), actionColumn];
  }, [columns, actionColumn]);

  const getDataSource = () => {
    if (data) {
      if (Array.isArray(data)) {
        return data;
      } else {
        return transform(data).list;
      }
    }
  };

  const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
    queryController?.setPagination(pagination.current!, pagination.pageSize!);
    if (Object.keys(filters).length > 0) {
      queryController?.patchFilters(filters);
    }
    if (Object.keys(sorter).length > 0 && !Array.isArray(sorter)) {
      queryController?.setSorter({
        field: sorter.field as string,
        order: sorter.order ?? undefined
      });
    }
  };

  const pagination = React.useMemo(() => {
    if (queryController) {
      const query = queryController.query;
      return {
        current: query.page,
        pageSize: query.size,
        total: list?.total
      };
    }
    return false;
  }, [queryController, list.total]);

  return (
    <>
      <Table
        {...rest}
        columns={mergedColumns}
        dataSource={getDataSource()}
        header={{
          toolbar: (
            <>
              {header}
              {toolbarActions.map(([key, action]) => (
                <ActionButton key={key} actionKey={key} action={action} open={open} />
              ))}
            </>
          )
        }}
        loading={loading}
        onChange={handleTableChange}
        pagination={pagination}
        rowKey={(row) => row.id}
      />
      {modalNode}
    </>
  );
};
