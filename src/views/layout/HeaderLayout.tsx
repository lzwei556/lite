import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Divider, Drawer, Dropdown, Space, Typography } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { DownOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import '../../assets/iconfont.css';
import { persistor, store } from '../../store';
import { Dayjs } from '../../utils';
import ProjectSelect from '../../components/select/projectSelect';
import { GetMyProjectRequest } from '../../apis/project';
import { Language, useLocaleContext } from '../../localeProvider';
import { NavMenu } from './NavMenu';
import './layout.css';
import { Brand } from './brand';

const { Text } = Typography;

const HeaderLayout = (props: any) => {
  const navigate = useNavigate();
  const { setLocale, language } = useLocaleContext();
  const { menus } = props;
  const [currentUser] = useState<any>(store.getState().auth.data.user);
  const [now, setNow] = useState<string>(Dayjs.dayjs().format('YYYY-MM-DD HH:mm:ss'));
  const [open, setVisible] = useState(false);

  setInterval(() => {
    setNow(Dayjs.dayjs().format('YYYY-MM-DD HH:mm:ss'));
  }, 1000);

  const onLogout = () => {
    persistor.purge().then((_) => {
      window.location.reload();
      localStorage.clear();
    });
  };

  const onProjectChange = (value: any) => {
    GetMyProjectRequest(value)
      .then((data) => {
        localStorage.removeItem('store');
        store.dispatch({
          type: 'SET_PROJECT',
          payload: { id: data.id, name: data.name, type: data.type }
        });
        window.location.href = '/';
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Header className='ts-header'>
      <div className='pc'>
        <Brand
          height={36}
          brandNameStyle={{
            fontSize: 18,
            letterSpacing: 2
          }}
        />
        {menus && <NavMenu menus={menus} />}
        <Space>
          <Text style={{ color: 'white', fontFamily: 'monospace' }} strong>
            {now}
          </Text>
          {currentUser && <ProjectSelect variant='borderless' onChange={onProjectChange} />}
          <Dropdown
            menu={{
              items: [
                { key: 'me', label: intl.get('MENU_USER_CENTER'), onClick: () => navigate('/me') },
                { key: 'logout', label: intl.get('LOGOUT'), onClick: onLogout }
              ]
            }}
          >
            <Button
              type={'text'}
              style={{ color: '#fff', paddingLeft: 0, paddingRight: 0 }}
              icon={<UserOutlined />}
            >
              {currentUser?.username}
              <DownOutlined />
            </Button>
          </Dropdown>
          <Dropdown
            menu={{
              items: [
                { key: 'zh-CN', label: '中文' },
                { key: 'en-US', label: 'EN' }
              ],
              onClick: ({ key }) => {
                if (key !== language) {
                  setLocale((prev) => ({
                    ...prev,
                    language: key as Language
                  }));
                }
              }
            }}
          >
            <Button
              icon={<DownOutlined />}
              iconPosition='end'
              type={'text'}
              style={{ color: '#fff', width: 60, paddingRight: 0 }}
            >
              {language === 'en-US' ? 'EN' : '中文'}
            </Button>
          </Dropdown>
        </Space>
      </div>
      <div className='mobile'>
        <MenuOutlined onClick={() => setVisible(true)} />
        <Brand
          className='logo'
          height={36}
          brandNameStyle={{
            fontSize: 18,
            letterSpacing: 2
          }}
        />
        <Dropdown
          menu={{ items: [{ key: 'logout', label: intl.get('LOGOUT'), onClick: onLogout }] }}
        >
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
          <NavMenu menus={menus} mode='inline' />
          <Divider />
          {currentUser && (
            <div style={{ paddingLeft: 24, paddingBottom: 100 }}>
              <ProjectSelect
                suffixIcon={<DownOutlined />}
                style={{ width: '120px', textAlign: 'center' }}
                onChange={onProjectChange}
              />
            </div>
          )}
        </Drawer>
      </div>
    </Header>
  );
};

export default HeaderLayout;
