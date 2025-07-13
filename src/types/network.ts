import { Device } from './device';
import { Asset } from './asset';

export type Network = {
  id: number;
  name: string;
  gateway: Device;
  asset: Asset;
  routingTables: [];
  nodes: Device[];
  communicationPeriod: number;
  communicationPeriod2: number;
  communicationOffset: number;
  groupSize: number;
  mode: number;
  groupSize2: number;
  intervalCnt: number;
};
