import { store } from '../store';

export const getPermission = () => {
  return store.getState().permission.data;
};
