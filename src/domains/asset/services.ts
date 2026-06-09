import { useRequest } from 'ahooks';
import { getList, get } from './api';

export const useList = () => useRequest(getList);

export const useOne = () => useRequest(get, { manual: true });
