import request from 'utils/request';
import { User } from './user';

type LoginInput = { username: string; password: string };
export type LoginResponse = { token: string };

export const login = async (params: LoginInput) => {
  return request.post<LoginResponse>('/login', params);
};

type AuthIdentity = User;

export const getIndentity = async () => {
  return request.get<AuthIdentity>('/my/profile');
};

export type UpdatePasswordData = { old: string; new: string };

export const updatePassword = async (param: UpdatePasswordData) => {
  return request.patch('/my/pass', param);
};
