import React from 'react';
import { ConfigProvider, theme as AntdTheme } from 'antd';
import { ThemeProvider } from 'antd-style';
import AppRouter from './views/router';
import { AuthProvider } from './providers/auth';
import { AccessControlProvider } from './providers/access-control';
import { NotificationProvider } from 'providers/notification';
import { useTheme } from 'providers/theme';
import { getLanguage, useI18n } from 'providers/i18n';
import { useUpdateDocumentTitle } from 'hooks';

export const Main = () => {
  const { language } = useI18n();
  const { theme } = useTheme();
  useUpdateDocumentTitle();

  const customDarkAlgorithm = (seedToken: any, mapToken: any) => {
    const mergeToken = AntdTheme.darkAlgorithm(seedToken, mapToken);

    return {
      ...mergeToken,
      colorTextBase: '#141414',
      colorBgBase: '#f2f3f5'
    };
  };
  return (
    <ThemeProvider
      appearance={theme}
      theme={(appearance) =>
        appearance === 'dark'
          ? { algorithm: [customDarkAlgorithm], components: { Tree: { indentSize: 8 } } }
          : {
              token: { colorBgLayout: '#f2f3f5' },
              components: { Menu: { itemHoverColor: '#1677ff' }, Tree: { indentSize: 8 } }
            }
      }
    >
      <ConfigProvider locale={getLanguage(language).antdLocale}>
        <NotificationProvider>
          <AuthProvider>
            <AccessControlProvider>
              <AppRouter />
            </AccessControlProvider>
          </AuthProvider>
        </NotificationProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
};
