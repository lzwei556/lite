import request from 'utils/request';

export type ServerStatus = {
  server: {
    os: { goos: string; numCpu: number; compiler: string; goVersion: string; numGoroutine: number };
    cpu: { cpus: number[]; cores: number };
    ram: { usedMB: number; totalMB: number; usedPercent: number };
    disk: { usedMB: number; usedGB: number; totalMB: number; totalGB: number; usedPercent: number };
  };
  mqtt: {
    address: string;
    username: string;
    password: string;
  };
};

export const get = async () => {
  return request.get<ServerStatus>('/system');
};
