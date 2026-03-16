import React, { createContext, useState, useContext } from 'react';

export enum ThemeKey {
  Light = 'light',
  Dark = 'dark'
}

type ThemeContextProps = { theme: ThemeKey; changeTheme: (theme: ThemeKey) => void };

const Context = createContext<ThemeContextProps>({} as ThemeContextProps);

export function useTheme() {
  return useContext(Context);
}

export const ThemeProvider = ({ children }: { children?: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeContextProps['theme']>(
    (localStorage.getItem('theme') as ThemeKey) ?? ThemeKey.Light
  );
  return (
    <Context.Provider
      value={{
        theme,
        changeTheme: (theme: ThemeKey) => {
          localStorage.setItem('theme', theme);
          setTheme(theme);
        }
      }}
    >
      {children}
    </Context.Provider>
  );
};
