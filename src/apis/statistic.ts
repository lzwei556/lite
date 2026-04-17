import request from '../utils/request';

export function GetAlertStatisticsRequest(filters: any) {
  return request.get<any>('/statistics/alerts', { ...filters });
}
