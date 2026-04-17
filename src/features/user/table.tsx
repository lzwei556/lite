import { TableWithOperations } from 'components';
import { Permission, useCan } from 'providers/access-control';
import React from 'react';
import intl from 'react-intl-universal';
import { CreateFormModal } from './create-form-modal';
import { UpdateFormModal } from './update-form-modal';
import { Fields, useList, User } from 'domain/user';
import { useStore } from 'hooks/store';
import { PageParameter } from 'types/page';

export default function UsersTable() {
  const [open, setOpen] = React.useState(false);
  const [editting, setEditting] = React.useState<User>();
  const [store, setStore, gotoPage] = useStore('accountList');
  const { data, runAsync } = useList();

  return (
    <TableWithOperations
      columns={[Fields.Username, Fields.Phone, Fields.Email].map((field) => ({
        dataIndex: field.name,
        title: intl.get(field.label)
      }))}
      listProps={{
        dataSource: data,
        fetch: runAsync,
        canCreate: useCan(Permission.UserAdd),
        canUpdate: useCan(Permission.UserEdit),
        canDelete: useCan(Permission.UserDelete),
        openCreate: () => setOpen(true),
        openUpdate: (editting) => {
          setOpen(true);
          setEditting(editting);
        },
        createFormModal: (
          <CreateFormModal
            {...{ open, onCancel: () => setOpen(false), onSuccess: () => console.log('success') }}
          />
        ),
        updateFormModal: (
          <UpdateFormModal
            {...{ open, onCancel: () => setOpen(false), onSuccess: () => console.log('success') }}
          />
        ),
        onDelete: () => {}
      }}
    />
  );
}
