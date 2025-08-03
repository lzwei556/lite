import { Asset } from '../types/asset';
import { Device } from '../types/device';
import { WSNDTO } from '../wsn';

export type Network = {
  id: number;
  name: string;
  gateway: Device;
  asset: Asset;
  routingTables: [];
  nodes: Device[];
} & WSNDTO['network'];
