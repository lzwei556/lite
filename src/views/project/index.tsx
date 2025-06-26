import { useEffect, useState } from 'react';
import { Button, Modal, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import {
  Card,
  Link,
  DeleteIconButton,
  EditIconButton,
  Table,
  transformPagedresult
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
import EditProjectModal from './editProjectModal';
import AllocUserDrawer from './allocUserDrawer';

const ProjectPage = () => {
  const [open, setVisible] = useState(false);
  const [allocVisible, setAllocVisible] = useState(false);
  const [dataSource, setDataSource] = useState<PageResult<any>>();
  const [project, setProject] = useState<Project>();
  const { hasPermissions } = usePermission();
  const [store, setStore, gotoPage] = useStore('projectList');
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const projectTypeOptions = useProjectTypeOptions();
  const [token, setToken] = useState<string>();

  const fetchProjects = (store: Store['firmwareList']) => {
    const {
      pagedOptions: { index, size }
    } = store;
    PagingProjectsRequest(index, size).then(setDataSource);
  };

  useEffect(() => {
    fetchProjects(store);
  }, [store, refreshKey]);

  const onAllocUser = (record: Project) => {
    setAllocVisible(true);
    setProject(record);
  };

  const onEdit = (record: Project) => {
    setProject(record);
    setVisible(true);
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
      setRefreshKey(refreshKey + 1);
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
      render: (_: any, record: any) => {
        return (
          <Space>
            {hasPermissions(Permission.ProjectAllocUser, Permission.ProjectAllocUserGet) && (
              <Link onClick={() => onAllocUser(record)} variant='button'>
                {intl.get('ASSIGN_USERS')}
              </Link>
            )}
            <HasPermission value={Permission.ProjectEdit}>
              <EditIconButton onClick={() => onEdit(record)} />
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
    <>
      <Table
        columns={columns}
        dataSource={ds}
        header={{
          title: intl.get('MENU_PROJECT_MANAGEMENT'),
          toolbar: [
            <HasPermission value={Permission.ProjectAdd}>
              <Button type={'primary'} onClick={() => setVisible(true)}>
                {intl.get('CREATE_PROJECT')}
                <PlusOutlined />
              </Button>
            </HasPermission>
          ]
        }}
        pagination={{
          ...paged,
          onChange: (index, size) =>
            setStore((prev) => ({ ...prev, pagedOptions: { index, size } }))
        }}
        rowKey={(row) => row.id}
      />
      {open && (
        <EditProjectModal
          open={open}
          project={project}
          onSuccess={() => {
            setVisible(false);
            setProject(undefined);
            if (dataSource) {
              const { size, page, total } = dataSource;
              gotoPage({ size, total, index: page }, 'next');
            }
          }}
          onCancel={() => {
            setVisible(false);
            setProject(undefined);
          }}
        />
      )}
      {allocVisible && project && (
        <AllocUserDrawer
          project={project}
          open={allocVisible}
          onSuccess={() => {
            setAllocVisible(false);
            setProject(undefined);
          }}
          onClose={() => {
            setAllocVisible(false);
            setProject(undefined);
          }}
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
    </>
  );
};

export default ProjectPage;
