import { MonitoringPointRow } from '../../monitoring-point';
import { Device } from '../../types/device';
import { ProcessDTO } from './use-services';

export const type = {
  label: 'process.type',
  name: 'type'
} as const;

export const sourceId = {
  label: 'source.id',
  name: 'source_id'
} as const;

export type CommonProps = {
  id: number;
  processList: ProcessDTO[];
  process?: ProcessDTO;
  monitoringPoints: MonitoringPointRow[];
  devices: Device[];
  onSuccess: () => void;
};
