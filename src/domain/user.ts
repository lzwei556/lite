import { useRequest } from 'ahooks';
import { RuleObject } from 'antd/es/form';
import intl from 'react-intl-universal';
import { Field } from 'types';
import { PageParameter, PageResult, useSearchPageInfo } from 'types/page';
import request from 'utils/request';
import { Role } from './role';

export type User = {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: Role;
};

export type CreateData = {
  username: string;
  password: string;
  confirmPwd: string;
  role: number;
  phone: string;
  email: string;
  projects: number[];
};

export type UpdateData = Pick<CreateData, 'username' | 'role' | 'phone' | 'email'>;

export const create = async (data: any) => {
  return await request.post('/users', data);
};

export const getList = async (param: PageParameter) => {
  return await request.get<PageResult<User[]>>('/users', param);
};

export const get = async (id: number) => {
  return await request.get<User>(`/users/${id}`);
};

export const update = async (id: number, data: any) => {
  return await request.put<User>(`/users/${id}`, data);
};

export const deleteOne = async (id: number) => {
  return await request.delete(`/users/${id}`);
};

export const useCreate = () => useRequest(create);

export const useList = () => {
  return useRequest(getList, { defaultParams: [useSearchPageInfo()] });
};

export const useUpdate = () => useRequest(update);

export const Fields = {
  Username: {
    name: 'username',
    label: 'USERNAME',
    rules: [{ required: true }, { min: 4, max: 16 }],
    type: 'string',
    description: ''
  } as Field<CreateData>,
  Password: {
    name: 'password',
    label: 'PASSWORD',
    rules: [{ required: true }, { min: 6, max: 16 }],
    type: 'password',
    description: ''
  } as Field<CreateData>,
  PasswordConfirm: {
    name: 'confirmPwd',
    label: 'CONFIRM_PASSWORD',
    rules: [
      { required: true, message: intl.get('PLEASE_CONFIRM_PASSWORD') },
      ({ getFieldValue }: any) => ({
        validator(_: RuleObject, value: any) {
          if (!value || getFieldValue('password') === value) {
            return Promise.resolve();
          }
          return Promise.reject(new Error(intl.get('PASSWORDS_ARE_INCONSISTENT')));
        }
      })
    ],
    type: 'password',
    description: ''
  } as Field<CreateData>,
  Role: {
    name: 'role',
    label: 'USER_ROLE',
    rules: [{ required: true }],
    type: 'enum',
    description: ''
  } as Field<CreateData>,
  Phone: {
    name: 'phone',
    label: 'CELLPHONE',
    rules: [{ pattern: /^1[3-9]\d{9}$/, message: intl.get('phone.is.invalid') }],
    type: 'string',
    description: ''
  } as Field<CreateData>,
  Email: {
    name: 'email',
    label: 'EMAIL',
    rules: [{ type: 'email', message: intl.get('email.is.invalid') }],
    type: 'string',
    description: ''
  } as Field<CreateData>,
  Projects: {
    name: 'projects',
    label: 'BIND_PROJECT',
    rules: [{ required: true }, { min: 4, max: 16 }],
    type: 'enum',
    description: ''
  } as Field<CreateData>
};

export const ACCOUNT_SUPER_ADMIN = {
  id: 1
};
