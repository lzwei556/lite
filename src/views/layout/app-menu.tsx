import React from 'react';
import { Badge, Button, Dropdown, Tag } from 'antd';
import Icon, { MenuOutlined, PoweroffOutlined, UserOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import {
  Language,
  LanguageOptions,
  Theme,
  ThemeOptions,
  useLocaleContext
} from '../../localeProvider';
import { ReactComponent as LightSVG } from './light.svg';
import { ReactComponent as DarkSVG } from './dark.svg';
import { useGlobalStyles } from '../../styles';
import { createStyles } from 'antd-style';
import { useNavigate } from 'react-router-dom';
import { useGetIdentity, useLogout } from '../../providers/auth';

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

export const AppMenu = () => {
  const { colorWhiteStyle } = useGlobalStyles();
  const { language, theme, setLocale } = useLocaleContext();
  const { styles, cx } = useStyles();
  const navigate = useNavigate();
  const logout = useLogout();
  const onLogout = () => {
    logout?.(() => {
      navigate('/login');
    });
  };
  const identity = useGetIdentity();

  const [selectedKeys, setSelectedKeys] = React.useState<{ language: Language; theme: Theme }>({
    language,
    theme
  });
  return (
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
                icon: <Icon component={() => (value === 'dark' ? <DarkSVG /> : <LightSVG />)} />,
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
                {identity?.username}
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
  );
};
