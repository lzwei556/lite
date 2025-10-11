import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Divider, Drawer, Dropdown, Space, Tag } from 'antd';
import { Header } from 'antd/es/layout/layout';
import Icon, { MenuOutlined, PoweroffOutlined, UserOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { createStyles } from 'antd-style';
import '../../assets/iconfont.css';
import { persistor } from '../../store';
import {
  Language,
  LanguageOptions,
  Theme,
  ThemeOptions,
  useLocaleContext
} from '../../localeProvider';
import { useGlobalStyles } from '../../styles';
import './layout.css';
import { Brand } from './brand';
import { ReactComponent as LightSVG } from './light.svg';
import { ReactComponent as DarkSVG } from './dark.svg';
import { MenuNavigator, ProjectsSelect } from '../../features/user-profile';
import { Clock } from './clock';
import { useGetIdentity } from '../../providers/auth';

const useStyles = createStyles(({ css, token }) => ({
  item: css`
    &.selected.selected-theme,
    &.selected.selected-lang {
      color: ${token.colorText};
      background-color: transparent;
      &:hover {
        background-color: ${token.controlItemBgHover};
      }
    }
  `
}));

const HeaderLayout = () => {
  const navigate = useNavigate();
  const [open, setVisible] = useState(false);
  const { colorWhiteStyle } = useGlobalStyles();
  const { language, theme, setLocale } = useLocaleContext();
  const { styles, cx } = useStyles();

  const onLogout = () => {
    persistor.purge().then((_) => {
      window.location.reload();
      localStorage.clear();
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
        <MenuNavigator className='ts-menu' mode='horizontal' />
        <Space>
          <Clock />
          <ProjectsSelect />
          <Dropdown
            menu={{
              items: [
                {
                  type: 'group',
                  key: 'theme',
                  label: intl.get('theme'),
                  children: ThemeOptions.map(({ value, label }) => {
                    const isSelected = selectedKeys.theme === value;
                    return {
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
                      extra: isSelected ? <Badge status='processing' /> : undefined,
                      className: cx(styles.item, `${isSelected ? 'selected selected-theme' : ''}`)
                    };
                  })
                },
                {
                  type: 'divider'
                },
                {
                  type: 'group',
                  key: 'language',
                  label: intl.get('language'),
                  children: LanguageOptions.map(({ key, label }) => {
                    const isSelected = selectedKeys.language === key;
                    return {
                      key,
                      label: key === 'en-US' ? 'English' : label,
                      icon: <Icon component={() => (key === 'en-US' ? 'EN' : '中')} />,
                      onClick: () => {
                        setLocale((prev) => ({ ...prev, language: key }));
                        if (key !== selectedKeys.language) {
                          setSelectedKeys((prev) => ({ ...prev, language: key }));
                        }
                      },
                      extra: isSelected ? <Badge status='processing' /> : undefined,
                      className: cx(styles.item, `${isSelected ? 'selected selected-lang' : ''}`)
                    };
                  })
                },
                {
                  type: 'divider'
                },
                {
                  type: 'group',
                  key: 'account',
                  label: (
                    <Tag color='success' bordered>
                      {useGetIdentity()?.username}
                    </Tag>
                  ),
                  children: [
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
                  ]
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
