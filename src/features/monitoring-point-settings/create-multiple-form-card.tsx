import { PlusOutlined } from '@ant-design/icons';
import { Avatar, List, Space } from 'antd';
import { MonitoringPointPostDTO } from 'common/monitoring-point';
import {
  Card,
  DeleteIconButtonWithoutConfirm,
  EditIconButton,
  IconButton,
  SaveIconButton
} from 'components';
import React from 'react';
import { Translation } from 'locales/utils';
import { truncate } from 'utils';
import { CreateFormModal } from './create-form-modal';

type Item = { _id: string } & MonitoringPointPostDTO;

export const CreateMultipleFormCard = ({ assetId }: { assetId: number }) => {
  const [items, dispatch] = useItems();
  const [editing, setEditing] = React.useState<Item | undefined>();
  const [open, setOpen] = React.useState(false);

  const openCreate = () => {
    setEditing(undefined);
    setOpen(true);
  };

  const openEdit = (item: Item) => {
    setEditing(item);
    setOpen(true);
  };

  const handleSuccess = (values: MonitoringPointPostDTO) => {
    if (editing) {
      dispatch({ type: 'update', id: editing._id, payload: values });
    } else {
      dispatch({ type: 'add', payload: values });
    }
    setOpen(false);
  };

  return (
    <Card
      extra={
        <Space>
          <IconButton icon={<PlusOutlined />} onClick={openCreate} />
          <SaveIconButton disabled={items.length === 0} />
          {open && (
            <CreateFormModal
              {...{
                assetId,
                open,
                onCancel: () => setOpen(false),
                onSuccess: handleSuccess,
                point: editing
              }}
            />
          )}
        </Space>
      }
      title={Translation.get('monitoring.points')}
    >
      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item
            actions={[
              <EditIconButton key='edit' onClick={() => openEdit(item)} />,
              <DeleteIconButtonWithoutConfirm
                key='delete'
                onClick={() => dispatch({ type: 'delete', id: item._id })}
              />
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar shape='square' size='large'>
                  {truncate(item.typeLabel!, 4)}
                </Avatar>
              }
              title={item.name}
            />
            <div>{item.deviceName}</div>
          </List.Item>
        )}
        rowKey={(item) => item._id}
      />
    </Card>
  );
};

const useItems = () => {
  return React.useReducer(
    (
      state: Item[],
      action:
        | { type: 'add'; payload: MonitoringPointPostDTO }
        | { type: 'update'; id: string; payload: MonitoringPointPostDTO }
        | { type: 'delete'; id: string }
    ): Item[] => {
      const { type } = action;
      switch (type) {
        case 'add':
          return [...state, { ...action.payload, _id: crypto.randomUUID() }];
        case 'update':
          return state.map((item) =>
            action.id === item._id ? { ...action.payload, _id: action.id } : item
          );
        case 'delete':
          return state.filter((item) => item._id !== action.id);
        default:
          return state;
      }
    },
    []
  );
};
