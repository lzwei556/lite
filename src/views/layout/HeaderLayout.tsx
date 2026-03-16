import { useState } from 'react';
import { Divider, Drawer, Dropdown, Space } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Translation } from 'locales/utils';
import '../../assets/iconfont.css';
import './layout.css';
import { Brand } from './brand';
import { MenuNavigator, ProjectsSelect } from '../../features/user-profile';
import { Clock } from './clock';
import { AppMenu } from './app-menu';

const HeaderLayout = () => {
  const [open, setVisible] = useState(false);

  return (
    <Header className='ts-header'>
      <div className='pc'>
        <Brand height={36} brandNameStyle={{ fontSize: 18 }} />
        <MenuNavigator className='ts-menu' mode='horizontal' />
        <Space>
          <Clock />
          <ProjectsSelect />
          <AppMenu />
        </Space>
      </div>
      <div className='mobile'>
        <MenuOutlined onClick={() => setVisible(true)} />
        <Brand className='logo' height={36} brandNameStyle={{ fontSize: 18 }} />
        <Dropdown menu={{ items: [{ key: 'logout', label: Translation.get('auth.logout') }] }}>
          <UserOutlined />
        </Dropdown>
        <Drawer
          open={open}
          placement='left'
          width='60%'
          closable={false}
          onClose={() => setVisible(false)}
          styles={{ body: { paddingLeft: 0, paddingRight: 0 } }}
        >
          <MenuNavigator className='ts-menu' mode='inline' />
          <Divider />
          <div style={{ paddingLeft: 24, paddingBottom: 100 }}>
            <ProjectsSelect />
          </div>
        </Drawer>
      </div>
    </Header>
  );
};

export default HeaderLayout;
