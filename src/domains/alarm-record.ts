import { Device } from 'types/device';
import * as Feature from 'domains/feature-property';
import { PageParameter, PageResult } from 'types/page';
import request from 'utils/request';
import intl from 'react-intl-universal';
import { getValue } from 'utils/format';
import { Dayjs, pickOptionsFromNumericEnum } from 'utils';
import { z } from 'zod';
import { zq } from 'resource';

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

export const options = pickOptionsFromNumericEnum(Status, 'alarm.record');

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

export const querySchema = z.object({
  createAt: zq.timestampRange(),
  name: zq.string(),
  types: zq.numberArray(),
  level: zq.numberArray(),
  status: zq.numberArray()
});

type QueryInput = z.infer<typeof querySchema> & {
  sourceId?: number;
};

type QueryOutput = Omit<QueryInput, 'createAt' | 'name' | 'types' | 'level' | 'status'> & {
  from?: number;
  to?: number;
  monitoring_point_name_like?: string;
  monitoring_point_types?: string;
  levels?: string;
  status?: string;
};

const transformQuery = (filters: QueryInput): QueryOutput => {
  const { createAt, name, types, level, status, ...rest } = filters;
  const data: QueryOutput = { ...rest };
  if (createAt) {
    data.from = createAt[0];
    data.to = createAt[1];
  }
  if (name) {
    data.monitoring_point_name_like = name;
  } else {
    delete data.monitoring_point_name_like;
  }
  if (types) {
    data.monitoring_point_types = types.join();
  } else {
    delete data.monitoring_point_types;
  }
  if (level) {
    data.levels = level.join();
  }
  if (status) {
    data.status = status.join();
  }
  return data;
};

export const getList = async ({ page, size, ...filters }: PageParameter & QueryInput) => {
  const data = await request.get<PageResult<DTO>>('alarmRecords', {
    page,
    size,
    ...transformQuery(filters)
  });
  return { ...data, result: data.result.map(transform) };
};

export const deleteOne = async ({ id }: { id: number }) => {
  return request.delete(`/alarmRecords/${id}`);
};
