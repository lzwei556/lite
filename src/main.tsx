import React from 'react';
import { ConfigProvider, theme as AntdTheme } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import enUS from 'antd/es/locale/en_US';
import 'dayjs/locale/zh-cn';
import { ThemeProvider } from 'antd-style';
import intl from 'react-intl-universal';
import { useLocaleContext } from './localeProvider';
import en_US from './locales/en-US.json';
import zh_CN from './locales/zh-CN.json';
import { Dayjs } from './utils';
import { App, useAppType } from './config';
import AppRouter from './views/router';
import { AuthProvider } from './providers/auth';
import { AccessControlProvider } from './providers/access-control';

export const Main = () => {
  const config = useAppType();
  const [renderingKey, setRenderingKey] = React.useState(0);
  const { language, theme } = useLocaleContext();

  React.useEffect(() => {
    intl.init({
      locales: {
        'en-US': en_US,
        'zh-CN': zh_CN
      },
      currentLocale: language
    });
    setRenderingKey((prev) => prev + 1);
    if (language === 'zh-CN') {
      Dayjs.dayjs.locale('zh-cn');
    } else {
      Dayjs.dayjs.locale('en');
    }
  }, [language]);

  React.useEffect(() => {
    if (renderingKey) {
      document.title = intl.get(App.getSiteName(config));
    }
  }, [language, renderingKey, config]);

  const customDarkAlgorithm = (seedToken: any, mapToken: any) => {
    const mergeToken = AntdTheme.darkAlgorithm(seedToken, mapToken);

    return {
      ...mergeToken,
      colorTextBase: '#141414',
      colorBgBase: '#f2f3f5'
    };
  };
  return (
    renderingKey && (
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
        <ConfigProvider locale={language === 'zh-CN' ? zhCN : enUS}>
          <AuthProvider>
            <AccessControlProvider>
              <AppRouter />
            </AccessControlProvider>
          </AuthProvider>
        </ConfigProvider>
      </ThemeProvider>
    )
  );
};
