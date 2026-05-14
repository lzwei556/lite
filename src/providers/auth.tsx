import React from 'react';
import request from '../utils/request';
import { useRequest } from 'ahooks';
import { GlobalStore } from '../utils/global-store';
import { ENV } from '../utils/env';
import { AuthIdentity, getIndentity } from 'domain/profile';
import { createActionState } from 'common/action';
import { RequestFn, useDataFetch } from 'hooks';
import intl from 'react-intl-universal';

const store = GlobalStore.getInstance(true);

export type LoginResponse = { token: string };

type AuthProviderProps = {
  login: RequestFn<LoginInput, LoginResponse>;
  logout: (onSuccess: () => void) => void;
  check: () => boolean;
  getIndentity: () => Promise<AuthIdentity>;
};

const AuthContext = React.createContext<Partial<AuthProviderProps>>({});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider
      value={{
        login,
        logout: (onSuccess: () => void) => {
          localStorage.clear();
          store.clear();
          onSuccess();
        },
        check,
        getIndentity
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useLogin = (onSuccess: () => void) => {
  const { login } = React.useContext(AuthContext);
  return createActionState(
    useDataFetch(login!, {
      onSuccess: ({ data, messageInstance }) => {
        store.set('authToken', data.token);
        messageInstance?.success(intl.get('LOGIN_SUCCEEDED'));
        onSuccess();
      }
    })
  );
};

export const useLogout = () => {
  const { logout } = React.useContext(AuthContext);
  return logout;
};

export const useIsAuthenticated = () => {
  const { check } = React.useContext(AuthContext);
  return ENV.authenticated === 'true' || check?.();
};

export const getAuthToken = () => store.get('authToken');

export const useGetIdentity = () => {
  const { getIndentity } = React.useContext(AuthContext);
  const { data } = useRequest(getIndentity!, {
    cacheKey: `${getAuthToken()}_profile`,
    staleTime: -1
  });
  return ENV.authenticated === 'true' ? { id: 1, username: 'admin', role: 0 } : data;
};

type LoginInput = { username: string; password: string };

const login = async (params: LoginInput) => {
  return request.post<LoginResponse>('/login', params);
};

const check = () => {
  return !!store.get('authToken');
};
