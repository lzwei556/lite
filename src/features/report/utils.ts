import React from 'react';
import { objectToCamel } from 'ts-case-convert';
import intl from 'react-intl-universal';
import { DeviceType } from '../../types/device_type';
import { PageResult } from '../../types/page';
import { transformPagedresult, useRange } from '../../components';
import { Store, useStore } from '../../hooks/store';
import request from '../../utils/request';
import { GetResponse } from '../../utils/response';
import { ReportType } from './constants';
import { Report, ReportDTO } from './types';

export const transform = (dto: ReportDTO): Report => {
  const { deviceFeatures, monitoringPointFeatures } = dto;
  const devices = deviceFeatures.map((d) => {
    const typeName = getTypeName(d);
    return { ...d, typeName, ...objectToCamel(d.features) };
  });
  const monitoringPoints = monitoringPointFeatures.map((m, i) => {
    const conditions: string[] = [];
    m.alarmRuleGroups.forEach((g) => {
      g.rules.forEach((rule) => {
        const { metric, operation, threshold } = rule;
        const name = metric && metric.name ? intl.get(metric.name) : '';
        conditions.push(`${name} ${operation ?? ''} ${threshold ?? ''}`);
      });
    });
    return {
      ...m,
      indexName: `${i + 1}`,
      ...objectToCamel(m.attributes),
      ...objectToCamel(m.features),
      conditions
    };
  });
  return { ...dto, devices, monitoringPoints };
};

const getTypeName = (d: Report['deviceFeatures'][0]) => {
  if (DeviceType.getNormalDCSensors().includes(d.type)) {
    return 'DC110';
  } else if (DeviceType.getHighDCSensors().includes(d.type)) {
    return 'DC110H';
  } else if (DeviceType.getUltraHighDCSensors().includes(d.type)) {
    return 'DC210';
  }
  return '';
};

export const useReports = (type: ReportType) => {
  const [dataSource, setDataSource] = React.useState<PageResult<Report[]>>();
  const { numberedRange, setRange } = useRange();
  const [store, setStore] = useStore('reportList');

  const fetchReports = (
    store: Store['reportList'],
    from: number,
    to: number,
    type = ReportType.Weekly
  ) => {
    const {
      pagedOptions: { index, size }
    } = store;
    getReports(index, size, from, to, type).then(setDataSource);
  };

  React.useEffect(() => {
    if (numberedRange) {
      const [from, to] = numberedRange;
      fetchReports(store, from, to, type);
    }
  }, [store, numberedRange, type]);

  return { ...transformPagedresult(dataSource), setRange, setStore };
};

function getReports(
  page: number,
  size: number,
  from: number,
  to: number,
  type = ReportType.Weekly
) {
  return request
    .get<PageResult<Report[]>>('/reports', { page, size, from, to, type })
    .then(GetResponse);
}

export const getReportType = (type: ReportType) => {
  return type === ReportType.Weekly ? '周' : '月';
};

export const formatNames = (names: string[]) => {
  const maxLen = 2;
  const join = '、';
  const suffix = names.length > maxLen ? '等' : '';
  return `（${names.filter((_, i) => i <= maxLen).join(join)}${suffix}）`;
};
