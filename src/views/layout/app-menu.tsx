import React from 'react';
import { Button, List, Popover, Tag, Typography } from 'antd';
import { MenuOutlined, PoweroffOutlined, UserOutlined } from '@ant-design/icons';
import { Translation } from 'locales/utils';
import { useGlobalStyles } from '../../styles';
import { useNavigate } from 'react-router-dom';
import { useGetIdentity, useLogout } from '../../providers/auth';
import { ThemeControl } from 'providers/theme';
import { LanguagesDropdown, useI18n } from 'providers/i18n';

export const AppMenu = () => {
  const { colorWhiteStyle } = useGlobalStyles();
  const navigate = useNavigate();
  const logout = useLogout();
  const onLogout = () => {
    logout?.(() => {
      navigate('/login');
    });
  };
  const identity = useGetIdentity();
  const { languages } = useI18n();

  return (
    <Popover
      styles={{ body: { paddingInline: 0, width: 300 } }}
      content={
        <List size='small'>
          <List.Item style={{ paddingBottom: 16 }}>
            <Tag color='success' bordered icon={<UserOutlined />}>
              {identity?.username}
            </Tag>
            <Typography.Link onClick={() => navigate('/me')}>
              {Translation.get('MENU_USER_CENTER')}
            </Typography.Link>
          </List.Item>
          <List.Item style={{ paddingTop: 16, border: 0 }}>
            <Typography.Text type='secondary'>{Translation.get('app.theme')}</Typography.Text>
            <ThemeControl />
          </List.Item>
          {languages.length > 1 && (
            <List.Item style={{ paddingBottom: 16 }}>
              <Typography.Text type='secondary'>
                {Translation.get('common.language')}
              </Typography.Text>
              <LanguagesDropdown />
            </List.Item>
          )}
          <List.Item style={{ paddingTop: 16 }}>
            <Button icon={<PoweroffOutlined />} onClick={onLogout}>
              {Translation.get('auth.logout')}
            </Button>
          </List.Item>
        </List>
      }
    >
      <Button type={'text'} style={{ ...colorWhiteStyle, fontSize: 16 }} icon={<MenuOutlined />} />
    </Popover>
  );
};
