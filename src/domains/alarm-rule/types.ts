import * as MonitoringPoint from 'domains/monitoring-point';
import intl from 'react-intl-universal';
import { z } from 'zod';
import { zq } from 'resource';
import { Option } from 'common/types';
import * as Feature from 'domains/feature-property';

// alarm rule begin
type MetricInput = string[];

export type Metric = { key: string; name: string; unit: string };

export const buildMetricData = (
  values: MetricInput,
  properties: Feature.Types.Property[]
): Metric | undefined => {
  if (values.length !== 0) {
    const property = properties.find(({ key }) => key === values[0]);
    if (property) {
      const field = (property.fields ?? []).find((f) => f.key === values?.[1]);
      const metric = {
        key: (values.length === 1 ? values.concat(values) : values).join('.'),
        name: (field ? [property.name, field.name] : [property.name]).join(':'),
        unit: property.unit ? intl.get(property.unit).d(property.unit) : property.unit || ''
      };
      return metric;
    }
  }
};

type RuleEditablePart = {
  duration: number;
  level: number;
  name: string;
  operation: string;
  threshold: number;
};

export type CreateData = {
  category: number;
  description: string;
  name: string;
  rules: (RuleEditablePart & { metric: MetricInput })[];
  type: number;
};

export type UpdateData = CreateData;

type RuleDTO = RuleEditablePart & {
  category: number;
  createdAt: number;
  description: string;
  enabled: boolean;
  id: number;
  metric: Metric;
  sourceType: number;
};

export type Rule = RuleDTO & {
  condition: string;
};

const transform2Rule = (dto: RuleDTO): Rule => {
  return { ...dto, condition: [dto.operation, dto.threshold, dto.metric.unit].join(' ') };
};

// alarm rule end

// alarm rule group begin

type DTO = {
  category: number;
  description: string;
  editable: boolean;
  id: number;
  monitoringPoints?: MonitoringPoint.Types.Entity[];
  name: string;
  rules: RuleDTO[];
  status: boolean;
  type: number;
};

export type AlarmRule = DTO & {
  translatedName: string;
  monitoringPointTypeText?: string;
  bindedStatus?: boolean;
  bindingStatus?: boolean;
  alertLevel?: number;
};

export const transform = (dto: DTO, monitoringPointTypes: Option[]): AlarmRule => {
  const monitoringPointType = monitoringPointTypes.find((opt) => opt.value === dto.type);
  return {
    ...dto,
    translatedName: intl.get(dto.name).d(dto.name),
    monitoringPointTypeText: monitoringPointType ? intl.get(monitoringPointType.label) : '',
    rules: dto.rules.map(transform2Rule)
  };
};

// alarm rule group end

export const querySchema = z.object({ ids: zq.numberArray() });

export type Query = z.infer<typeof querySchema>;
