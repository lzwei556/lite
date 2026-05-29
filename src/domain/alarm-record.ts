import { Device } from 'types/device';
import * as Feature from 'domain/feature-property';
import { PageParameter, PageResult } from 'types/page';
import request from 'utils/request';
import intl from 'react-intl-universal';
import { getValue } from 'utils/format';
import { Dayjs, pickOptionsFromNumericEnum } from 'utils';

type Metric = {
  key: string;
  name: string;
  unit: string;
};

type DTO = {
  id: number;
  alarmRuleGroupName: string;
  alarmRuleGroupId: number;
  metric: Metric;
  source: {
    id: number;
    name: string;
    type: number;
    assetId: number;
    componentId: number;
    normalDataTimestamp: number;
    attributes: {
      index: number;
    };
    bindingDevices: Device[];
    properties: Feature.Types.Property[];
    data: {
      timestamp: number;
      values: { [PropertyKey: string]: number };
    };
    alertStates: [
      {
        rule: {
          id: number;
          level: number;
        };
        record: {
          id: number;
          value: number;
        };
      }
    ];
    alertLevel: number;
  };
  sourceType: string;
  operation: string;
  level: number;
  value: number;
  threshold: number;
  status: number;
  acknowledged: boolean;
  category: number;
  createdAt: number;
  updatedAt: number;
};

type AlarmRecord = DTO & {
  alarmName: string;
  sourceName: string;
  alarmDetail: string;
  createAtText: string;
  durationText: string;
};

export enum Status {
  UnProcessed = 0,
  AutoProcessed = 2
}

export const options = pickOptionsFromNumericEnum(Status, 'alarm.record')

const transform = (dto: DTO): AlarmRecord => {
  return {
    ...dto,
    alarmName:
      dto.alarmRuleGroupId === 0 ? intl.get('alarm.record.deleted') : dto.alarmRuleGroupName,
    sourceName: dto.source ? dto.source.name : intl.get('unknown'),
    alarmDetail: getDetail(dto),
    createAtText: Dayjs.format(dto.createdAt),
    durationText:
      dto.status === Status.AutoProcessed
        ? Dayjs.toDate(dto.createdAt).from(Dayjs.toDate(dto.updatedAt), true)
        : Dayjs.toDate(dto.createdAt).fromNow(true)
  };
};

const getDetail = (record: DTO) => {
  const { operation, threshold, value, metric } = record;
  const { name, unit } = metric;
  const thresholdValue = getValue({ value: threshold, unit });
  const alarmValue = getValue({ value, unit });
  return `${translateMetricName(name)} ${operation} ${thresholdValue} ${intl.get(
    'ALARM_VALUE'
  )}: ${alarmValue}`;
};

const translateMetricName = (name: string) => {
  if (!name) return name;
  if (name.indexOf(':')) {
    return name
      .split(':')
      .map((n) => intl.get(n))
      .join(':');
  } else {
    return intl.get(name);
  }
};

type Filters = {
  from: number;
  to: number;
  types?: string;
  name?: string;
  sourceId?: number;
  levels?: string;
  status?: string;
};

type FiltersData = Omit<Filters, 'name' | 'types'> & {
  monitoring_point_name_like?: string;
  monitoring_point_types: number[];
};

const transformFilters = (filters: Filters): FiltersData => {
  const { name, types, ...rest } = filters;
  const data: FiltersData = { ...rest, monitoring_point_types: [] };
  if (name) {
    data.monitoring_point_name_like = name;
  } else {
    delete data.monitoring_point_name_like;
  }
  if (types) {
    data.monitoring_point_types = types.split(',').map(Number);
  } else {
    data.monitoring_point_types = [];
  }
  return data;
};

export const getList = async ({ page, size, ...filters }: PageParameter & Filters) => {
  const data = await request.get<PageResult<DTO>>('alarmRecords', {
    page,
    size,
    ...transformFilters(filters)
  });
  return { ...data, result: data.result.map(transform) };
};

export const deleteOne = async ({ id }: { id: number }) => {
  return request.delete(`/alarmRecords/${id}`);
};
