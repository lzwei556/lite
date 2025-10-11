import React from 'react';
import request from '../utils/request';
import { useRequest } from 'ahooks';
import { GlobalStore } from '../utils/global-store';
import { ENV } from '../utils/env';
import { ResponseResult } from '../types/response';

const store = GlobalStore.getInstance(true);

export type LoginResponse = { token: string };
export type AuthIdentity = { id: number; username: string };

type AuthProviderProps = {
  login: (params: LoginInput) => Promise<ResponseResult<LoginResponse>>;
  check: () => boolean;
  getIndentity: () => Promise<AuthIdentity>;
};

const AuthContext = React.createContext<Partial<AuthProviderProps>>({});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider value={{ login, check, getIndentity }}>{children}</AuthContext.Provider>
  );
};

export const useLogin = (onSuccess: () => void, onError: (e: Error) => void) => {
  const { login } = React.useContext(AuthContext);
  return useRequest(login!, {
    manual: true,
    onSuccess: (res) => {
      if (res && res.code === 200) {
        store.set('authToken', res.data.token);
        onSuccess();
      } else {
        onError(new Error(res.msg));
      }
    },
    onError: (e) => onError(e)
  });
};

export const useLogout = () => {};

export const useIsAuthenticated = () => {
  const { check } = React.useContext(AuthContext);
  return ENV.authenticated === 'true' || check?.();
};

export const getAuthToken = () => store.get('authToken');

export const useGetIdentity = () => {
  const { getIndentity } = React.useContext(AuthContext);
  const { data } = useRequest(getIndentity!);
  return ENV.authenticated === 'true' ? { id: 1, username: 'admin' } : data;
};

type LoginInput = { username: string; password: string };

const login = async (params: LoginInput) => {
  return request.post<LoginResponse>('/login', params).then((res) => res.data);
};

const check = () => {
  return !!store.get('authToken');
};

const getIndentity = async () => {
  return request.get<AuthIdentity>('/my/profile').then((res) => res.data.data);
};
