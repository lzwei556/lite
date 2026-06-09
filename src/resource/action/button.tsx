import React from 'react';
import { ActionConfig, ActionModalOpen, BaseEntity } from '../types';
import { Button } from 'antd';
import intl from 'react-intl-universal';
import { DeleteIconButton, EditIconButton, IconButton } from 'components';
import { PlusOutlined } from '@ant-design/icons';

export const ActionButton = <T extends BaseEntity>({
  actionKey: key,
  action,
  hidden,
  open,
  record
}: {
  actionKey: string;
  action: ActionConfig;
  hidden?: (record?: T) => boolean;
  open: ActionModalOpen<T, any>;
  record?: T;
}) => {
  if (hidden?.(record)) {
    return null;
  }
  if (action.render) {
    return action.render({ key, action, open, record });
  } else if (key === 'create') {
    return (
      <IconButton
        icon={<PlusOutlined />}
        onClick={() => open(key)}
        tooltipProps={{
          title: action.label ? intl.get(action.label).d(action.label) : action.label
        }}
        type='primary'
      />
    );
  } else if (key === 'update') {
    return <EditIconButton onClick={() => open(key, record)} />;
  } else if (key === 'delete') {
    return (
      <DeleteIconButton
        confirmProps={{
          description: intl.get('DELETE_USER_PROMPT'),
          onConfirm: () => action?.state?.submit({ id: record?.id })
        }}
      />
    );
  } else {
    return (
      <Button
        {...action.buttonProps}
        onClick={() => {
          if (action.modal) {
            open(key);
            return;
          }
        }}
      />
    );
  }
};
