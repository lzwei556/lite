import React from 'react';
import { Modal, Space, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { PlusOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
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
import HasPermission from '../../permission';
import usePermission, { Permission } from '../../permission/permission';
import { Store, useStore } from '../../hooks/store';
import { store as reduxStore } from '../../store';
import { useProjectTypeOptions } from '../../project';
import { EditProjectModal } from './editProjectModal';
import { AllocUserDrawer } from './allocUserDrawer';

type ModalType = 'update' | 'assign' | undefined;

const ProjectPage = () => {
  const [open, setOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState<ModalType>();
  const [dataSource, setDataSource] = React.useState<PageResult<any>>();
  const [project, setProject] = React.useState<Project>();
  const { hasPermissions } = usePermission();
  const [store, setStore, gotoPage] = useStore('projectList');
  const projectTypeOptions = useProjectTypeOptions();
  const [token, setToken] = React.useState<string>();

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
      reduxStore.dispatch({
        type: 'SET_PROJECT',
        payload: { id: 0 }
      });
      if (dataSource) {
        const { size, page, total } = dataSource;
        gotoPage({ size, total, index: page }, 'prev');
      }
      window.location.reload();
    });
  };

  const onGenAccessToken = (id: number) => {
    GenProjectAccessTokenRequest(id).then((_) => {
      fetchProjects(store);
    });
  };

  const columns = [
    {
      title: intl.get('PROJECT_NAME'),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: intl.get('ACCESS_CREDENTIALS'),
      dataIndex: 'token',
      key: 'token',
      render: (token: string, record: Project) => {
        if (token) {
          return (
            <Link onClick={() => setToken(token)} variant='button'>
              {intl.get('CLICK_TO_VIEW')}
            </Link>
          );
        }
        return (
          <Link onClick={() => onGenAccessToken(record.id)} variant='button'>
            {intl.get('CLICK_TO_GENERATE_ACCESS_CREDENTIAL')}
          </Link>
        );
      }
    },
    {
      title: intl.get('DESCRIPTION'),
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: intl.get('project.type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: number) => {
        const label = projectTypeOptions.find((o) => o.value === type)?.label;
        return label ? intl.get(label) : '-';
      }
    },
    {
      title: intl.get('OPERATION'),
      key: 'action',
      render: (_: string, record: Project) => {
        return (
          <Space>
            {hasPermissions(Permission.ProjectAllocUser, Permission.ProjectAllocUserGet) && (
              <Link onClick={() => trigger('assign', record)} variant='button'>
                {intl.get('ASSIGN_USERS')}
              </Link>
            )}
            <HasPermission value={Permission.ProjectEdit}>
              <EditIconButton onClick={() => trigger('update', record)} />
            </HasPermission>
            <HasPermission value={Permission.ProjectDelete}>
              <DeleteIconButton
                confirmProps={{
                  description: intl.get('DELETE_PROJECT_PROMPT'),
                  onConfirm: () => onDelete(record.id)
                }}
              />
            </HasPermission>
          </Space>
        );
      }
    }
  ];

  const { paged, ds } = transformPagedresult(dataSource);

  return (
    <Content>
      <Typography.Title level={4}>{intl.get('MENU_PROJECT_MANAGEMENT')}</Typography.Title>
      <Table
        columns={columns}
        dataSource={ds}
        header={{
          toolbar: (
            <HasPermission value={Permission.ProjectAdd}>
              <IconButton
                icon={<PlusOutlined />}
                onClick={() => trigger()}
                tooltipProps={{ title: intl.get('CREATE_PROJECT') }}
                type='primary'
              />
            </HasPermission>
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
        title={intl.get('ACCESS_CREDENTIALS')}
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
