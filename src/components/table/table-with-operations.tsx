import { Space, TableProps } from 'antd';
import { Table } from './table';
import React from 'react';
import intl from 'react-intl-universal';
import {
  BaseEntity,
  ActionControllerOptions,
  useActionController,
  ActionButton
} from 'common/action';
import { transform } from 'types/page';

export const ResourceTable = <T extends BaseEntity>({
  actionController,
  columns,
  pagination = false,
  ...rest
}: TableProps<T> & {
  actionController: ActionControllerOptions<T>;
}) => {
  const { dataSource, loading, actions, open, modalNode } = useActionController(actionController);

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
        {...rest}
        columns={mergedColumns}
        dataSource={getDataSource()}
        header={{
          toolbar: toolbarActions.map(([key, action]) => (
            <ActionButton key={key} actionKey={key} action={action} open={open} />
          ))
        }}
        loading={loading}
        pagination={pagination}
        rowKey={(row) => row.id}
      />
      {modalNode}
    </>
  );
};
