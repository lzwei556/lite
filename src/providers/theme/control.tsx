import React from 'react';
import { ReactComponent as LightSVG } from './light.svg';
import { ReactComponent as DarkSVG } from './dark.svg';
import { ThemeKey, useTheme } from './provider';
import { Segmented } from 'antd';
import { Translation } from 'locales/utils';
import Icon from '@ant-design/icons';

type Theme = { key: ThemeKey; label: string; icon: React.ReactNode };

const PREFIX = 'app.theme';

const themeTable: Record<ThemeKey, Omit<Theme, 'key'>> = {
  [ThemeKey.Light]: { label: `${PREFIX}.light`, icon: <LightSVG /> },
  [ThemeKey.Dark]: { label: `${PREFIX}.dark`, icon: <DarkSVG /> }
};

export const getTheme = (key: ThemeKey): Theme => {
  const entry = themeTable[key];
  return { key, ...entry };
};

export const options = [ThemeKey.Light, ThemeKey.Dark].map(getTheme);

export const ThemeControl = () => {
  const { theme, changeTheme } = useTheme();
  return (
    <Segmented
      options={options.map((opt) => ({
        ...opt,
        label: Translation.get(opt.label),
        icon: <Icon component={() => opt.icon} />,
        value: opt.key
      }))}
      onChange={changeTheme}
      value={theme}
    />
  );
};
