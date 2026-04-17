import request from 'utils/request';
import { DTO, Entity } from './types';
import * as MonitoringPoint from '../monitoring-point';

export const getList = async (): Promise<Entity[]> => {
  return await request.get<Entity[]>(`/assets`, { parent_id: 0 });
};

export const get = async (id: number): Promise<Entity> => {
  return await request.get<Entity>(`/assets/${id}`);
};
