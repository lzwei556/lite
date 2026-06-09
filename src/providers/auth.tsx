import React from 'react';
import { GlobalStore } from '../utils/global-store';
import { ENV } from '../utils/env';
import { getIndentity, login, updatePassword } from 'domains/auth';
import intl from 'react-intl-universal';
import { ACCOUNT_SUPER_ADMIN } from 'domains/user';
import { createActionState, useDataFetch, useUpdate } from 'resource';

const store = GlobalStore.getInstance(true);

type AuthProviderProps = {
  login: typeof login;
  logout: (onSuccess: () => void) => void;
  check: () => boolean;
  getIndentity: typeof getIndentity;
  updatePassword: typeof updatePassword;
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
        getIndentity,
        updatePassword
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
      manual: true,
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
  const { data } = useDataFetch(getIndentity!, {
    cacheKey: `${getAuthToken()}_profile`,
    staleTime: -1
  });
  return ENV.authenticated === 'true' ? ACCOUNT_SUPER_ADMIN : data;
};

const check = () => {
  return !!store.get('authToken');
};

export const useUpdatePassword = () =>
  useUpdate(updatePassword, {
    manual: true,
    onSuccess: ({ messageInstance }) => messageInstance?.success('password.update.success')
  });
