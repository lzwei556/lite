export type AlarmRuleTemplate = {
  id: number;
  name: string;
  measurementType: number;
  rule: AlarmRule;
  level: number;
  description: string;
};

export type AlarmRule = {
  id: number;
  name: string;
  description: string;
  duration: number;
  threshold: number;
  operation: string;
  sourceType: string;
  level: number;
  sources: any[];
  category: number;
};
