import React from 'react';
import { Modal, Space, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { PlusOutlined } from '@ant-design/icons';
import { Translation } from 'locales/utils';
import {
  Card,
  Link,
  DeleteIconButton,
  EditIconButton,
  Table,
  transformPagedresult,
  IconButton
} from '../../components';
import { PageResult } from '../../types/page';
import {
  DeleteProjectRequest,
  GenProjectAccessTokenRequest,
  PagingProjectsRequest
} from '../../apis/project';
import { Project } from '../../types/project';
import { Store, useStore } from '../../hooks/store';
import { useProjectTypeOptions } from '../../project';
import { EditProjectModal } from './editProjectModal';
import { AllocUserDrawer } from './allocUserDrawer';
import { ProfileContext, useDeleteProject } from '../../providers/user-profile';
import { CanAccess, Permission } from '../../providers/access-control';

type ModalType = 'update' | 'assign' | undefined;

const ProjectPage = () => {
  const [open, setOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState<ModalType>();
  const [dataSource, setDataSource] = React.useState<PageResult<any>>();
  const [project, setProject] = React.useState<Project>();
  const [store, setStore, gotoPage] = useStore('projectList');
  const projectTypeOptions = useProjectTypeOptions();
  const [token, setToken] = React.useState<string>();
  const { selectedProject } = React.useContext(ProfileContext);
  const deleteProject = useDeleteProject();

  const fetchProjects = (store: Store['projectList']) => {
    const {
      pagedOptions: { index, size }
    } = store;
    PagingProjectsRequest(index, size).then(setDataSource);
  };

  React.useEffect(() => {
    fetchProjects(store);
  }, [store]);

  const trigger = (modalType?: ModalType, project?: Project) => {
    setOpen(true);
    setModalType(modalType);
    setProject(project);
  };

  const reset = () => {
    setOpen(false);
    setModalType(undefined);
    setProject(undefined);
  };

  const onDelete = (id: number) => {
    DeleteProjectRequest(id).then(() => {
      if (selectedProject?.id === id) {
        deleteProject().then(() => {
          if (dataSource) {
            const { size, page, total } = dataSource;
            gotoPage({ size, total, index: page }, 'prev');
          }
        });
      }
    });
  };

  const onGenAccessToken = (id: number) => {
    GenProjectAccessTokenRequest(id).then((_) => {
      fetchProjects(store);
    });
  };

  const columns = [
    {
      title: Translation.get('common.name'),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: Translation.get('project.list.access.credentials'),
      dataIndex: 'token',
      key: 'token',
      render: (token: string, record: Project) => {
        if (token) {
          return (
            <Link onClick={() => setToken(token)} variant='button'>
              {Translation.get('common.action.view')}
            </Link>
          );
        }
        return (
          <Link onClick={() => onGenAccessToken(record.id)} variant='button'>
            {Translation.get('project.list.access.credentials.clicking')}
          </Link>
        );
      }
    },
    {
      title: Translation.get('common.description'),
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: Translation.get('project.type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: number) => {
        const label = projectTypeOptions.find((o) => o.value === type)?.label;
        return label ? Translation.get(label) : '-';
      }
    },
    {
      title: Translation.get('common.operation'),
      key: 'action',
      render: (_: string, record: Project) => {
        return (
          <Space>
            <CanAccess {...Permission.ProjectAllocUser}>
              <Link onClick={() => trigger('assign', record)} variant='button'>
                {Translation.get('project.user-assignment')}
              </Link>
            </CanAccess>
            <CanAccess {...Permission.ProjectEdit}>
              <EditIconButton onClick={() => trigger('update', record)} />
            </CanAccess>
            <CanAccess {...Permission.ProjectDelete}>
              <DeleteIconButton
                confirmProps={{
                  description: Translation.get('feedback.prompt.delete'),
                  onConfirm: () => {
                    onDelete(record.id);
                  }
                }}
              />
            </CanAccess>
          </Space>
        );
      }
    }
  ];

  const { paged, ds } = transformPagedresult(dataSource);

  return (
    <Content>
      <Typography.Title level={4}>{Translation.get('MENU_PROJECT_MANAGEMENT')}</Typography.Title>
      <Table
        columns={columns}
        dataSource={ds}
        header={{
          toolbar: (
            <CanAccess {...Permission.ProjectAdd}>
              <IconButton
                icon={<PlusOutlined />}
                onClick={() => trigger()}
                tooltipProps={{ title: Translation.createSth('project') }}
                type='primary'
              />
            </CanAccess>
          )
        }}
        pagination={{
          ...paged,
          onChange: (index, size) =>
            setStore((prev) => ({ ...prev, pagedOptions: { index, size } }))
        }}
        rowKey={(row) => row.id}
      />
      {project && modalType === 'assign' ? (
        <AllocUserDrawer project={project} open={open} onSuccess={reset} onClose={reset} />
      ) : (
        <EditProjectModal
          key={project?.id}
          open={open}
          project={project}
          onSuccess={() => {
            reset();
            if (dataSource && !project) {
              const { size, page, total } = dataSource;
              gotoPage({ size, total, index: page }, 'next');
            } else {
              fetchProjects(store);
            }
          }}
          onCancel={reset}
        />
      )}
      <Modal
        open={!!token}
        title={Translation.get('project.list.access.credentials')}
        onCancel={() => setToken(undefined)}
        footer={null}
      >
        <Card size={'small'}>
          <Typography.Text copyable={{ text: token }}>{token}</Typography.Text>
        </Card>
      </Modal>
    </Content>
  );
};

export default ProjectPage;
