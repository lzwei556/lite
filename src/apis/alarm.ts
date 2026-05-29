import request from '../utils/request';
import { PageResult } from '../types/page';
import { AlarmRule } from '../types/alarm_rule_template';
import { Alarm } from '../types/alarm_rule';
import { DeleteResponse, GetResponse, PostResponse, PutResponse } from '../utils/response';

export function AddAlarmRuleRequest(params: any) {
  return request.post('/alarmRules', params).then(PostResponse);
}

export function PagingAlarmRuleRequest(filters: any, page: number, size: number) {
  return request
    .get<PageResult<AlarmRule[]>>('/alarmRules', { ...filters, page, size })
    .then(GetResponse);
}

export function GetAlarmRuleRequest(id: number) {
  return request.get<any>(`/alarmRules/${id}`).then(GetResponse);
}

export function UpdateAlarmRuleRequest(id: number, params: any) {
  return request.put<Alarm>(`/alarmRules/${id}`, params).then(PutResponse);
}

export function UpdateAlarmRuleStatusRequest(id: number, status: number) {
  return request.put(`/alarmRules/${id}/status/${status}`, null).then(PutResponse);
}

export function AddAlarmRuleSourceRequest(id: number, params: any) {
  return request.post(`/alarmRules/${id}/sources`, params).then(PostResponse);
}

export function RemoveAlarmRuleSourceRequest(id: number, params: any) {
  return request.delete(`/alarmRules/${id}/sources`, params).then(DeleteResponse);
}

export function RemoveAlarmRuleRequest(id: number) {
  return request.delete(`/alarmRules/${id}`).then(DeleteResponse);
}
