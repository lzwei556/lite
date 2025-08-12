import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Divider, Drawer, Dropdown, Space, Typography } from 'antd';
import { Header } from 'antd/es/layout/layout';
import Icon, {
  DownOutlined,
  MenuOutlined,
  PoweroffOutlined,
  UserOutlined
} from '@ant-design/icons';
import intl from 'react-intl-universal';
import { createStyles } from 'antd-style';
import '../../assets/iconfont.css';
import { persistor, store } from '../../store';
import { Dayjs } from '../../utils';
import ProjectSelect from '../../components/select/projectSelect';
import { GetMyProjectRequest } from '../../apis/project';
import {
  Language,
  LanguageOptions,
  Theme,
  ThemeOptions,
  useLocaleContext
} from '../../localeProvider';
import { useGlobalStyles } from '../../styles';
import { NavMenu } from './NavMenu';
import './layout.css';
import { Brand } from './brand';
import { ReactComponent as LightSVG } from './light.svg';
import { ReactComponent as DarkSVG } from './dark.svg';

const useStyles = createStyles(({ css, token }) => ({
  item: css`
    color: ${token.colorText} !important;
    background-color: transparent !important;
  `
}));

const HeaderLayout = (props: any) => {
  const navigate = useNavigate();
  const { menus } = props;
  const [currentUser] = useState<any>(store.getState().auth.data.user);
  const [now, setNow] = useState<string>(Dayjs.dayjs().format('YYYY-MM-DD HH:mm:ss'));
  const [open, setVisible] = useState(false);
  const { colorWhiteStyle } = useGlobalStyles();
  const { language, theme, setLocale } = useLocaleContext();
  const { styles } = useStyles();

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
  const [selectedKeys, setSelectedKeys] = useState<{ language: Language; theme: Theme }>({
    language,
    theme
  });

  return (
    <Header className='ts-header'>
      <div className='pc'>
        <Brand height={36} brandNameStyle={{ fontSize: 18 }} />
        {menus && <NavMenu menus={menus} />}
        <Space>
          <Typography.Text style={{ color: 'white', fontFamily: 'monospace' }} id='current-time'>
            {now}
          </Typography.Text>
          {currentUser && <ProjectSelect variant='borderless' onChange={onProjectChange} />}
          <Dropdown
            menu={{
              items: [
                {
                  type: 'group',
                  key: 'theme',
                  label: intl.get('theme'),
                  children: ThemeOptions.map(({ value, label }) => ({
                    key: value,
                    label: intl.get(label),
                    icon: (
                      <Icon component={() => (value === 'dark' ? <DarkSVG /> : <LightSVG />)} />
                    ),
                    onClick: () => {
                      setLocale((prev) => ({ ...prev, theme: value }));
                      if (value !== selectedKeys.theme) {
                        setSelectedKeys((prev) => ({ ...prev, theme: value }));
                      }
                    },
                    extra: selectedKeys.theme === value ? <Badge status='processing' /> : undefined,
                    className: styles.item
                  }))
                },
                {
                  type: 'divider'
                },
                {
                  type: 'group',
                  key: 'language',
                  label: intl.get('language'),
                  children: LanguageOptions.map(({ key, label }) => ({
                    key,
                    label: key === 'en-US' ? 'English' : label,
                    icon: <Icon component={() => (key === 'en-US' ? 'EN' : '中')} />,
                    onClick: () => {
                      setLocale((prev) => ({ ...prev, language: key }));
                      if (key !== selectedKeys.language) {
                        setSelectedKeys((prev) => ({ ...prev, language: key }));
                      }
                    },
                    extra:
                      selectedKeys.language === key ? <Badge status='processing' /> : undefined,
                    className: styles.item
                  }))
                },
                {
                  type: 'divider'
                },
                {
                  key: 'me',
                  label: intl.get('MENU_USER_CENTER'),
                  icon: <UserOutlined />,
                  onClick: () => navigate('/me')
                },
                {
                  key: 'logout',
                  label: intl.get('LOGOUT'),
                  icon: <PoweroffOutlined />,
                  onClick: onLogout
                }
              ],
              selectedKeys: [selectedKeys.language, selectedKeys.theme],
              selectable: true,
              multiple: true
            }}
            overlayStyle={{ width: 160 }}
          >
            <Button type={'text'} style={{ ...colorWhiteStyle, top: 3 }} icon={<MenuOutlined />} />
          </Dropdown>
        </Space>
      </div>
      <div className='mobile'>
        <MenuOutlined onClick={() => setVisible(true)} />
        <Brand className='logo' height={36} brandNameStyle={{ fontSize: 18 }} />
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
