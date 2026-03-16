import React from 'react';
import { Button, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useI18n } from './provider';
import { getLanguage, LanguageCode } from './language';

export const LanguagesDropdown = ({ style }: { style?: React.CSSProperties }) => {
  const { changeLanguage, languages, language } = useI18n();

  return (
    languages.length > 1 && (
      <Dropdown
        menu={{
          items: languages.map((code) => ({ key: code, label: getLanguage(code).label })),
          onClick: ({ key }) => {
            if (key !== language) {
              changeLanguage(key as LanguageCode);
            }
          }
        }}
      >
        <Button icon={<DownOutlined />} iconPosition='end' type={'text'} style={style}>
          {getLanguage(language).label}
        </Button>
      </Dropdown>
    )
  );
};
