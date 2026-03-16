import React from 'react';
import { Button, Col, Drawer, DrawerProps, Tree } from 'antd';
import Search from 'antd/es/input/Search';
import { Translation } from 'locales/utils';
import { Project } from '../../types/project';
import { AllocUsersRequest, GetAllocUsersRequest } from '../../apis/project';
import { AllocUser } from '../../types/alloc_user';
import { Grid } from '../../components';
import { ProfileContext, useInit } from '../../providers/user-profile';
import { useGetIdentity } from '../../providers/auth';

type Item = AllocUser & { checked: boolean };

export const AllocUserDrawer = ({
  project,
  onSuccess,
  ...rest
}: DrawerProps & { onSuccess: () => void; project: Project }) => {
  const [users, setUsers] = React.useState<Item[]>([]);
  const [username, setUsername] = React.useState<string>();
  const filteredUsers = users.filter((item) =>
    username ? item.user.username.indexOf(username) > -1 : true
  );
  const treeData = convertTreeData(filteredUsers);
  const checkedKeys = convertCheckedKeys(filteredUsers);
  const { init } = useInit(React.useContext(ProfileContext).setProjects);
  const crtUser = useGetIdentity();

  React.useEffect(() => {
    GetAllocUsersRequest(project.id).then((users) =>
      setUsers(users.map((user) => ({ ...user, checked: user.isAllocated })))
    );
  }, [project.id]);

  function convertTreeData(users: AllocUser[]) {
    return [
      {
        title: Translation.get('project.user-assignment.users'),
        key: 'users',
        checkable: false,
        children: users.map(({ user }) => {
          return {
            title: user.username,
            key: user.id
          };
        })
      }
    ];
  }

  function convertCheckedKeys(users: Item[]) {
    return users.filter((item) => item.checked).map((item) => item.user.id);
  }

  const onSave = () => {
    AllocUsersRequest(project.id, { user_ids: checkedKeys }).then(() => {
      onSuccess();
      if (crtUser && checkedKeys.includes(crtUser.id)) {
        init();
      }
    });
  };

  return (
    <Drawer
      {...rest}
      title={project.name}
      placement={'right'}
      extra={
        <Button type={'primary'} onClick={onSave}>
          {Translation.get('common.action.save')}
        </Button>
      }
    >
      <Grid>
        <Col span={24}>
          <Search
            placeholder={Translation.get('project.user-assignment.username-search')}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Col>
        {filteredUsers.length > 0 && (
          <Col span={24}>
            <Tree
              defaultExpandAll={true}
              treeData={treeData}
              showIcon={true}
              selectable={false}
              checkable={true}
              checkedKeys={checkedKeys}
              onCheck={(checked: any) =>
                setUsers((prev) =>
                  prev.map((item) => ({ ...item, checked: checked.includes(item.user.id) }))
                )
              }
            />
          </Col>
        )}
      </Grid>
    </Drawer>
  );
};
