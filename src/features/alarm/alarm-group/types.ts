import * as MonitoringPoint from 'domain/monitoring-point';

export type AlarmRule = {
  id: number;
  name: string;
  description: string;
  category: number;
  type: number;
  rules: {
    id: number;
    name: string;
    description: string;
    index?: any;
    duration: number;
    operation: string;
    threshold: number;
    level: number;
    source_type?: number;
    category: number;
    metric: any;
  }[];
  monitoringPoints?: MonitoringPoint.Types.Entity[];
  bindedStatus?: boolean;
  bindingStatus?: boolean;
  alertLevel?: number;
  editable: boolean;
};
