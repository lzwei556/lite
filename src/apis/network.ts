import request from '../utils/request';
import { Network } from '../types/network';
import { DeleteResponse, GetResponse, PostResponse, PutResponse } from '../utils/response';

export function GetNetworkRequest(id: number) {
  return request.get<Network>(`/networks/${id}`).then(GetResponse);
}

export function GetNetworksRequest() {
  return request.get<Network[]>('/networks').then(GetResponse);
}

export function ImportNetworkRequest(params: any) {
  return request.post('/networks/import', params).then(PostResponse);
}

export function CreateNetworkRequest(params: any) {
  return request.post('/networks', params).then(PostResponse);
}

export function ExportNetworkRequest(id: number) {
  return request.download<any>(`/networks/${id}/export`);
}

export function UpdateNetworkRequest(id: number, params: any) {
  return request.put<Network>(`/networks/${id}`, params).then(PutResponse);
}

export function NetworkSyncRequest(id: number) {
  return request.put(`/networks/${id}/sync`, null).then((res) => res.data);
}

export function NetworkProvisionRequest(id: number) {
  return request.put(`/networks/${id}/provision`, null).then((res) => res.data);
}

export function DeleteNetworkRequest(id: number) {
  return request.delete(`/networks/${id}`).then(DeleteResponse);
}
