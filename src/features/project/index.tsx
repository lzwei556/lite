import { TableWithOperations } from 'components';
import { Permission, useCan } from 'providers/access-control';
import React from 'react';
import intl from 'react-intl-universal';
import { CreateFormModal } from './create-form-modal';
import { UpdateFormModal } from './update-form-modal';
import { create, deleteOne, Fields, update } from 'domain/project';
import { createActionState, useCreate, useDelete, useList, useUpdate } from 'hooks/data';
import { Content } from 'antd/es/layout/layout';
import { Typography, TableColumnsType } from 'antd';
import { Project } from 'domain/project';
import { getMyProjects } from 'domain/profile';

export default function Projects() {
  const list = useList(getMyProjects);

  const createState = createActionState(
    useCreate(create, {
      onSuccess: () => {
        list.refresh();
      }
    })
  );
  const updateState = createActionState(
    useUpdate(update, {
      onSuccess: () => {
        list.refresh();
      }
    })
  );
  const deleteState = createActionState(useDelete(deleteOne, { onSuccess: () => list.refresh() }));

  return (
    <Content>
      <Typography.Title level={4}>{intl.get('MENU_PROJECT_MANAGEMENT')}</Typography.Title>
      <TableWithOperations
        columns={(
          [Fields.Name, Fields.Description].map((field) => ({
            dataIndex: field.name,
            title: intl.get(field.label)
          })) as TableColumnsType<Project>
        ).concat([
          {
            dataIndex: Fields.Type.name,
            title: intl.get(Fields.Type.label),
            render: Fields.Type.valueToLabel
          }
        ])}
        listProps={{
          dataSource: list.data,
          actions: {
            create: {
              can: useCan(Permission.ProjectAdd),
              modal: ({ open, close }) => <CreateFormModal {...{ open, close, ...createState }} />
            },
            update: {
              can: useCan(Permission.ProjectEdit),
              modal: ({ open, close, record }) => (
                <UpdateFormModal {...{ open, close, ...updateState, project: record }} />
              )
            },
            delete: { can: useCan(Permission.ProjectDelete), state: deleteState }
          }
        }}
        scroll={{ y: 600 }}
      />
    </Content>
  );
}
