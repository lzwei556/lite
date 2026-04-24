import request from 'utils/request';
import { Enum } from './project-type';
import { Field } from 'types/entity';
import { useAppConfig } from 'providers/app';
import * as ProjectType from 'domain/project-type';
import intl from 'react-intl-universal';

export type Project = {
  id: number;
  name: string;
  description: string;
  token: string;
  type: Enum;
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

export const create = async (data: CreateData) => {
  return request.post('/projects', data);
};

export const update = async (params: UpdateData) => {
  const { id, data } = params;
  return request.put<Project>(`/projects/${id}`, data);
};

export const deleteOne = async ({ id }: { id: number }) => {
  return request.delete(`/projects/${id}`);
};

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
    defaultValue: ProjectType.Enum.ConditionMonitoring,
    valueToLabel: (value: number) => intl.get(ProjectType.getLabel(value))
  } as Field<CreateData>
};

export const useProjectTypeField = () => {
  if (useAppConfig().appTypeFromServer === 'general') {
    return Fields.Type;
  }
};
