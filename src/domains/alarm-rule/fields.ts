import { Field } from 'types';
import { AlarmRule, Rule } from './types';

export const AlarmRuleGroupFields = {
  Name: {
    name: 'name',
    label: 'NAME',
    type: 'string',
    rules: [{ required: true }, { min: 4, max: 16 }]
  } as Field<AlarmRule>,
  Type: {
    name: 'type',
    label: 'monitoring.point.type',
    type: 'enum',
    rules: [{ required: true }]
  } as Field<AlarmRule>,
  Description: {
    name: 'description',
    label: 'DESCRIPTION'
  } as Field<AlarmRule>
};

export const RuleFields = {
  Name: { name: 'name', label: 'NAME' } as Field<Rule>,
  Metric: { name: 'metric', label: 'ALARM_METRIC' } as Field<Rule>,
  Condition: { name: 'condition', label: 'ALARM_CONDITION' } as Field<Rule>,
  Level: { name: 'level', label: 'ALARM_LEVEL' } as Field<Rule>
};
