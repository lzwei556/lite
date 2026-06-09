import request from 'utils/request';
import { Enum } from './project-type';
import { Field } from 'types/entity';
import { useAppConfig } from 'providers/app';
import * as ProjectType from 'domains/project-type';
import intl from 'react-intl-universal';
import { User } from './user';

export type DTO = { id: number; name: string; description: string; token: string; type: Enum };

export type Project = DTO & {
  typeText: string;
};

export const transform = (dto: DTO): Project => {
  return { ...dto, typeText: intl.get(ProjectType.getLabel(dto.type)) };
};

export type CreateData = {
  name: string;
  description: string;
  type: number;
};

export type UpdateData = {
  id: number;
  data: Pick<CreateData, 'name' | 'description'>;
};

export type UserAssignmentData = { id: number; user_ids: number[] };

export const create = async (data: CreateData) => {
  return request.post('/projects', data);
};

export const update = async (param: UpdateData) => {
  const { id, data } = param;
  return request.put<Project>(`/projects/${id}`, data);
};

export const deleteOne = async ({ id }: { id: number }) => {
  return request.delete(`/projects/${id}`);
};

export const generateToken = async ({ id }: { id: number }) => {
  return request.post(`/projects/${id}/token`, null);
};

export const getAssignedUsers = async ({ id }: { id: number }) => {
  return request.get<{ isAllocated: boolean; user: User }[]>(`/projects/${id}/users`);
};

export function assignUsers(param: UserAssignmentData) {
  const { id, user_ids } = param;
  return request.patch(`/projects/${id}/users`, { user_ids });
}

export const Fields = {
  Name: {
    name: 'name',
    label: 'NAME',
    rules: [{ required: true }, { min: 4, max: 32 }],
    type: 'string',
    description: ''
  } as Field<CreateData>,
  Description: {
    name: 'description',
    label: 'DESCRIPTION',
    type: 'string-textarea',
    description: ''
  } as Field<CreateData>,
  Type: {
    name: 'type',
    label: 'TYPE',
    rules: [{ required: true }],
    type: 'enum',
    options: ProjectType.options,
    description: '',
    defaultValue: ProjectType.Enum.ConditionMonitoring
  } as Field<CreateData>,
  TypeText: { name: 'typeText', label: 'TYPE' } as Field<Project>,
  UserIds: {
    name: 'user_ids',
    label: '',
    type: 'enum',
    description: ''
  } as Field<UserAssignmentData>
};

export const useProjectTypeField = () => {
  if (useAppConfig().appTypeFromServer === 'general') {
    return Fields.Type;
  }
};
