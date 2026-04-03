import React from 'react';
import { TimeDomainData, useTimeDomainList, UseTimeDomainListResult } from './useTimeDomain';
import { OriginalDomainResponse, useOriginalDomain } from './useOriginalDomain';
import { Property } from './useTrend';
import { AssetRow } from 'asset-common';
import { TMonitoringPoint } from 'domain/monitoring-point';

export type Filters = {
  axis: TMonitoringPoint.Settings.AxisWithVibrationDirectionLabel;
  property: Property;
};

export type AnalysisProps = {
  monitoringPoint: {
    id: number;
    parent: AssetRow;
    attributes?: TMonitoringPoint.Base['attributes'];
  };
  trend: { timestamp: number; timestamps: number[] };
  filters: { axis: TMonitoringPoint.Settings.AxisWithVibrationDirectionLabel; property: Property };
  intermediateData: AnalysisDataProps;
};

export type AnalysisDataProps = {
  timeDomains: UseTimeDomainListResult;
  timeDomain?: { loading: boolean; data?: TimeDomainData };
  originalDomain?: OriginalDomainResponse;
};

export type TimeDomainInput = Filters & { id: number; timestamp: number };

export const useAnalysisDataProps = ({
  id,
  axis,
  property,
  timestamp
}: TimeDomainInput): AnalysisDataProps => {
  const timeDomains = useTimeDomainList({
    id,
    axis,
    property,
    initialTimestamps: [timestamp]
  });
  const timeDomain = {
    loading: timeDomains.loading,
    data: getTimeDomainOfActiveTimestamp(timeDomains.getDataList(), timestamp)
  };
  const originalDomain = useOriginalDomain(id, timestamp, axis.value);
  return { timeDomains, timeDomain, originalDomain };
};

const getTimeDomainOfActiveTimestamp = (list: TimeDomainData[], timestamp: number) => {
  const ts = list.filter((t) => t.timestamp === timestamp);
  if (ts.length > 0) {
    return ts[ts.length - 1];
  }
};

const analysisWithOnlyAcceleration = ['time-envelope', 'envelope', 'cross'];

export const useAnalysisTabsProps = () => {
  const [activeKey, setActiveKey] = React.useState('time-domain');
  const isAnalysisOnlyAcceleration = analysisWithOnlyAcceleration.includes(activeKey);

  return { activeKey, setActiveKey, isAnalysisOnlyAcceleration };
};
