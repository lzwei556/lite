import { getValue } from 'utils';
import intl from 'react-intl-universal';
import request from 'utils/request';
import { Property } from 'asset-common';
import { AlarmRule, buildMetricData, CreateData, Query, UpdateData } from './types';
import * as Feature from 'domains/feature-property';

export const create = async ({
  properties,
  ...data
}: CreateData & { properties: Feature.Types.Property[] }) => {
  const transform = {
    ...data,
    rules: data.rules.map((r) => ({
      ...r,
      metric: buildMetricData(r.metric, properties)
    }))
  };
  return request.post(`alarmRuleGroups`, transform);
};

export const getList = async ({ ids }: Query = {}) => {
  const params = ids && ids.length > 0 ? { monitoring_point_ids: ids.join() } : undefined;
  return request.get<AlarmRule[]>(`alarmRuleGroups`, params);
};

export const update = async ({ id, data }: { id: number; data: UpdateData }) => {
  return request.put(`alarmRuleGroups/${id}`, data);
};

export const deleteOne = async ({ id }: { id: number }) => {
  return request.delete(`alarmRuleGroups/${id}`);
};

export const bind = async ({ id, pIds }: { id: number; pIds: number[] }) => {
  return request.post(`/alarmRuleGroups/${id}/bind`, { monitoring_point_ids: pIds });
};

export const unbind = async ({ id, pIds }: { id: number; pIds: number[] }) => {
  return request.post(`/alarmRuleGroups/${id}/unbind`, { monitoring_point_ids: pIds });
};
// TO-DO, what's differences between bind and bind2?
export const bind2 = async ({ id, pIds }: { id: number; pIds: number[] }) => {
  return request.put(`/alarmRuleGroups/${id}/bindings`, { monitoring_point_ids: pIds });
};

type ExportResponse = {
  alarmRuleGroups: AlarmRule[];
  projectId: number;
  projectName: string;
};

export const download = async ({ ids }: { ids?: number[] }) => {
  const param = ids && ids.length > 0 ? { alarm_rule_group_ids: ids.join() } : undefined;
  // return request.download(`alarmRuleGroups/exportFile`, param);
  return request.get<ExportResponse>(`alarmRuleGroups/exportFile`, param);
};

export const upload = async (data: ExportResponse) => {
  return request.post(`alarmRuleGroups/import`, data);
};

// 当 property key = 'attitude'，并且子项的 length =1，key='attitude_index'时，强制修改 property key = 'attitude_index'
const changePropertyKey = (property: Property) => {
  const { fields } = property;
  if (
    property.key === 'attitude' &&
    fields &&
    fields.length === 1 &&
    fields[0].key === 'attitude_index'
  ) {
    return removeSingleField({ ...property, key: fields[0].key });
  }
  return property;
};

// 当子项和当前 property 信息完全一致时，移除子项
const removeSingleField = (property: Property) => {
  const { fields } = property;
  if (fields && fields.length === 1 && property.key === fields[0].key) {
    return { ...property, fields: [] };
  }
  return property;
};

export const getPropertiesByMonitoringPonitType = async ({ type }: { type: number }) => {
  const res = await request.get<Property[]>(`properties`, {
    type: 'monitoring_point',
    monitoring_point_type: type
  });
  return res.map(changePropertyKey).map(removeSingleField);
};

export const translateMetricName = (name: string) => {
  if (!name) return name;
  if (name.includes(':')) {
    return name
      .split(':')
      .map((n) => intl.get(n))
      .join(':');
  }
  return intl.get(name);
};

export const getAlarmDetail = (
  record: { operation: string; threshold: number; value: number },
  metric: { name: string; unit: string; value: number }
) => {
  const { operation, threshold, value } = record;
  const { name, unit } = metric;
  const thres = getValue({ value: threshold, unit });
  const alarmValue = getValue({ value, unit });
  return `${translateMetricName(name)} ${operation} ${thres} ${intl.get(
    'ALARM_VALUE'
  )}: ${alarmValue}`;
};
