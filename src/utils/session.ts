import { store } from '../store';
import { ENV } from './env';

export const isLogin = (): boolean => {
  return ENV.authenticated === 'true' || store.getState().auth.data.token;
};

export const getToken = (): string => {
  return store.getState().auth.data.token;
};

export const getPermission = () => {
  return store.getState().permission.data;
};

export const getCurrentUser = () => {
  return ENV.authenticated === 'true' ? { username: 'admin' } : store.getState().auth.data.user;
};
