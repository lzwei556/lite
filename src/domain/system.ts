import { useRequest } from 'ahooks';
import request from 'utils/request';

export type System = {
  server: {
    os: { goos: string; numCpu: number; compiler: string; goVersion: string; numGoroutine: number };
    cpu: { cpus: number[]; cores: number };
    ram: { usedMB: number; totalMB: number; usedPercent: number };
    disk: { usedMB: number; usedGB: number; totalMB: number; totalGB: number; usedPercent: number };
  };
  mqtt: any;
};

export const useOne = () => useRequest(get);

const get = async () => {
  return await request.get<System>('/system');
};
