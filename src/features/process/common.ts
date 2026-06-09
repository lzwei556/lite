import { Device } from '../../types/device';
import { ProcessDTO } from './use-services';
import * as MonitoringPoint from 'domains/monitoring-point';

export const typeField = {
  label: 'process.type',
  name: 'type'
} as const;

export const sourceIdField = {
  label: 'source.id',
  name: 'source_id'
} as const;

export type CommonProps = {
  monitoringPoint: MonitoringPoint.Types.Entity;
  processList: ProcessDTO[];
  process?: ProcessDTO;
  monitoringPoints: MonitoringPoint.Types.Entity[];
  devices?: Device[];
  initialProcess?: { type: number; oilFillerId?: number };
  onSuccess: () => void;
};
