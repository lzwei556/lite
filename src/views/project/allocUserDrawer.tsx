import { FC, useCallback, useEffect, useState } from 'react';
import { Button, Col, Drawer, DrawerProps, Space, Tree } from 'antd';
import Search from 'antd/es/input/Search';
import intl from 'react-intl-universal';
import { Project } from '../../types/project';
import { AllocUsersRequest, GetAllocUsersRequest } from '../../apis/project';
import { AllocUser } from '../../types/alloc_user';
import { Grid } from '../../components';

export interface AllocUserDrawerProps extends DrawerProps {
  project: Project;
  onSuccess: () => void;
}

const AllocUserDrawer: FC<AllocUserDrawerProps> = (props) => {
  const { project, open, onSuccess } = props;
  const [ds, setDs] = useState<AllocUser[]>([]);
  const [treeData, setTreeData] = useState<any>();
  const [checkedKeys, setCheckedKeys] = useState<any[]>([]);

  const fetchUsers = useCallback(() => {
    GetAllocUsersRequest(project.id).then((ds: AllocUser[]) => {
      setDs(ds);
      if (ds) {
        setTreeData(convertTreeData(ds));
        setCheckedKeys(convertCheckedKeys(ds));
      }
    });
  }, [project.id]);

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open, fetchUsers]);

  const onSave = () => {
    AllocUsersRequest(project.id, { user_ids: checkedKeys }).then((_) => onSuccess());
  };

  const renderExtra = () => {
    return (
      <Space>
        <Button type={'primary'} onClick={onSave}>
          {intl.get('SAVE')}
        </Button>
      </Space>
    );
  };

  const convertTreeData = (dataSource: AllocUser[]) => {
    return [
      {
        title: intl.get('USER_LIST'),
        key: 'users',
        checkable: false,
        children: dataSource.map((item) => {
          return {
            title: item.user.username,
            key: item.user.id
          };
        })
      }
    ];
  };

  const convertCheckedKeys = (dataSource: AllocUser[]) => {
    return dataSource.filter((item) => item.isAllocated).map((item) => item.user.id);
  };

  const onCheck = (value: any) => {
    setCheckedKeys(value);
  };

  const onChange = (value: any) => {
    setTreeData(convertTreeData(ds?.filter((item) => item.user.username.indexOf(value) !== -1)));
    setCheckedKeys(
      convertCheckedKeys(ds?.filter((item) => item.user.username.indexOf(value) !== -1))
    );
  };

  return (
    <Drawer {...props} title={project.name} placement={'right'} extra={renderExtra()}>
      <Grid>
        <Col span={24}>
          <Search
            placeholder={intl.get('PLEASE_ENTER_USERNAME_TO_SEARCH')}
            onChange={(e) => onChange(e.target.value)}
          />
        </Col>
        <Col span={24}>
          {treeData && (
            <Tree
              defaultExpandAll={true}
              treeData={treeData}
              showIcon={true}
              selectable={false}
              checkable={true}
              checkedKeys={checkedKeys}
              onCheck={onCheck}
            />
          )}
        </Col>
      </Grid>
    </Drawer>
  );
};

export default AllocUserDrawer;
