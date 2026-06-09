import request from '../utils/request';
import { DeleteResponse, GetResponse, PutResponse } from '../utils/response';
import { HistoryData } from '.';
import { AssetModel } from './types';
import { Types } from 'domains/asset';

export function getAssets(filters?: Partial<Pick<AssetModel, 'type' | 'parent_id' | 'id'>>) {
  return request.get<Types.DTO[]>(`/assets`, { ...filters }).then(GetResponse);
}

export function updateAsset(id: number, asset: AssetModel) {
  return request.put(`/assets/${id}`, asset).then(PutResponse);
}

export function uploadAssetImage(id: number, data: any) {
  return request.axios.post(`/assets/${id}/image`, data, {
    headers: { 'Content-type': 'image/png' }
  });
}

export function deleteAsset(id: number) {
  return request.delete(`/assets/${id}`).then(DeleteResponse);
}

export function exportAssets(projectId: number, asset_ids?: number[]) {
  if (asset_ids && asset_ids.length > 0) {
    return request.download<any>(
      `my/projects/${projectId}/exportFile?asset_ids=${asset_ids.join(',')}`
    );
  } else {
    return request.download<any>(`my/projects/${projectId}/exportFile`);
  }
}

export function importAssets(id: number, data: any) {
  return request.post<any>(`my/projects/${id}/import`, data);
}

export type ProjectStatistics = {
  deviceOfflineNum: number;
  deviceNum: number;
  monitoringPointAlarmNum: [number, number, number];
  monitoringPointNum: number;
  rootAssetAlarmNum: [number, number, number];
  rootAssetNum: number;
};

export function getProjectStatistics() {
  return request.get<ProjectStatistics>(`/statistics/all`);
}

export function downloadHistory(
  id: number,
  from: number,
  to: number,
  pids: any,
  lang: string,
  assetId?: number
) {
  if (assetId) {
    return request.download<any>(
      `/assets/${assetId}/download/data?from=${from}&to=${to}&pids=${pids}&lang=${lang}`
    );
  } else {
    return request.download<any>(
      `/monitoringPoints/${id}/download/data?from=${from}&to=${to}&pids=${pids}&lang=${lang}`
    );
  }
}

export function getDataOfAsset(id: number, from: number, to: number) {
  return request
    .get<{ timestamp: number }[]>(`/assets/${id}/data?from=${from}&to=${to}`)
    .then(GetResponse);
}

export function getFlangeData(id: number, timestamp: number) {
  return request.get<HistoryData[0]>(`/assets/${id}/data/${timestamp}`).then(GetResponse);
}
