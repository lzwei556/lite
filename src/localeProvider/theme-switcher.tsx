import React from 'react';
import { Select } from 'antd';
import { ThemeOptions, useLocaleContext } from '.';

export const ThemeSwitcher = () => {
  const { theme, setLocale } = useLocaleContext();

  return (
    <Select
      options={ThemeOptions}
      onChange={(theme) => {
        setLocale((prev) => ({ ...prev, theme }));
      }}
      value={theme}
      variant='outlined'
    />
  );
};
