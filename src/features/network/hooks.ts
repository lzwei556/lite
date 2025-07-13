import { Asset } from '../../types/asset';
import { Device } from '../../types/device';
import { WSNUpdate } from '../wsn';

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

export const tranformNetwork2WSNUpdate = (network: Network): WSNUpdate => {
  return {
    mode: network.mode,
    wsn: {
      communication_period: network.communicationPeriod,
      communication_period_2: network.communicationPeriod2,
      communication_offset: network.communicationOffset,
      group_size: network.groupSize,
      group_size_2: network.groupSize2,
      interval_cnt: network.intervalCnt
    }
  };
};
