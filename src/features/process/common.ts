import { MonitoringPointRow } from 'monitoring-point';
import { Device } from '../../types/device';
import { ProcessDTO } from './use-services';

export const typeField = {
  label: 'process.type',
  name: 'type'
} as const;

export const sourceIdField = {
  label: 'process.source',
  name: 'source_id'
} as const;

export type CommonProps = {
  monitoringPoint: MonitoringPointRow;
  processList: ProcessDTO[];
  process?: ProcessDTO;
  monitoringPoints: MonitoringPointRow[];
  devices?: Device[];
  initialProcess?: { type: number; oilFillerId?: number };
  onSuccess: () => void;
};
