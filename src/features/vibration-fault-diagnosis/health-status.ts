import { color } from './common';

enum HealthStatusValue {
  Healthy = 0,
  Warning = 1,
  Critical = 2,
  Fault = 3
}

enum HealthStatusLabel {
  Healthy = 'health.status.healthy',
  Warning = 'health.status.warning',
  Critical = 'health.status.critical',
  Fault = 'health.status.fault'
}

enum HealthIndexRange {
  Healthy = '>= 85',
  Warning = '85 - 70',
  Critical = '70 - 50',
  Fault = '< 50'
}

export type HealthStatus = {
  label: HealthStatusLabel;
  value: HealthStatusValue;
  color: (typeof color)[keyof typeof color];
  range: HealthIndexRange;
};

export const healthStatusTable: Record<HealthStatusValue, Omit<HealthStatus, 'value'>> = {
  [HealthStatusValue.Healthy]: {
    label: HealthStatusLabel.Healthy,
    color: color.Healthy,
    range: HealthIndexRange.Healthy
  },
  [HealthStatusValue.Warning]: {
    label: HealthStatusLabel.Warning,
    color: color.Warning,
    range: HealthIndexRange.Warning
  },
  [HealthStatusValue.Critical]: {
    label: HealthStatusLabel.Critical,
    color: color.Critical,
    range: HealthIndexRange.Critical
  },
  [HealthStatusValue.Fault]: {
    label: HealthStatusLabel.Fault,
    color: color.Fault,
    range: HealthIndexRange.Fault
  }
};

export const getHealthStatusByValue = (value: HealthStatusValue): HealthStatus => {
  const entry = healthStatusTable[value];
  return { value, ...entry };
};

