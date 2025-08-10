import React from 'react';
import { Button, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Language, LanguageOptions, useLocaleContext } from '.';

export const LangSwitcher = ({ style }: { style?: React.CSSProperties }) => {
  const { setLocale, language } = useLocaleContext();

  return (
    <Dropdown
      menu={{
        items: LanguageOptions,
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
      <Button icon={<DownOutlined />} iconPosition='end' type={'text'} style={style}>
        {language === 'en-US' ? 'EN' : '中文'}
      </Button>
    </Dropdown>
  );
};
