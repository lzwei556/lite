import { Content } from 'antd/es/layout/layout';
import { Typography } from 'antd';
import { Link, ResourceTable } from 'components';
import { Permission, useCan } from 'providers/access-control';
import React from 'react';
import intl from 'react-intl-universal';
import {
  AssignUsersDrawer,
  CreateFormModal,
  TokenModal,
  UpdateFormModal,
  useDeleteProject,
  useUpdateMyProjects
} from 'features/project';
import { assignUsers, create, deleteOne, Fields, generateToken, update } from 'domain/project';
import { useDataFetch, useList } from 'hooks/data';
import { getMyProjects } from 'domain/profile';
import { createActionState } from 'common/action';

export default function Projects() {
  const list = useList(getMyProjects);
  const deleteProject = useDeleteProject();
  const updateMyProjects = useUpdateMyProjects();
  const generateTokenState = createActionState(
    useDataFetch(generateToken, { manual: true, onSuccess: () => list.refresh() })
  );

  return (
    <Content>
      <Typography.Title level={4}>{intl.get('MENU_PROJECT_MANAGEMENT')}</Typography.Title>
      <ResourceTable
        columns={[Fields.Name, Fields.Description, Fields.TypeText].map((field) => ({
          dataIndex: field.name,
          title: intl.get(field.label)
        }))}
        actionController={{
          list,
          api: { create, update, delete: deleteOne },
          actions: {
            create: {
              can: useCan(Permission.ProjectAdd),
              modal: (ctx) => <CreateFormModal {...ctx} />
            },
            update: {
              can: useCan(Permission.ProjectEdit),
              modal: (ctx) => <UpdateFormModal {...ctx} />
            },
            delete: {
              can: useCan(Permission.ProjectDelete),
              onSuccess: ({ id }) => {
                deleteProject(id);
              }
            },
            generateToken: {
              position: 'row',
              modal: (ctx) => <TokenModal {...ctx} />,
              render: ({ record, open }) => {
                if (record.token.length > 0) {
                  return (
                    <Link onClick={() => open('generateToken', record)} variant='button'>
                      {intl.get('CLICK_TO_VIEW')}
                    </Link>
                  );
                } else {
                  return (
                    <Link
                      onClick={() => generateTokenState.submit({ id: record.id })}
                      variant='button'
                    >
                      {intl.get('CLICK_TO_GENERATE_ACCESS_CREDENTIAL')}
                    </Link>
                  );
                }
              }
            },
            assign: {
              position: 'row',
              modal: (ctx) => <AssignUsersDrawer {...ctx} />,
              render: ({ open, record }) => (
                <Link onClick={() => open('assign', record)} variant='button'>
                  {intl.get('ASSIGN_USERS')}
                </Link>
              ),
              state: createActionState(
                useDataFetch(assignUsers, {
                  manual: true,
                  onSuccess: ({ params, messageInstance }) => {
                    updateMyProjects(params.user_ids);
                    messageInstance?.success('save.success');
                  }
                })
              )
            }
          }
        }}
        scroll={{ y: 600 }}
      />
    </Content>
  );
}
