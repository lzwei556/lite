import { Fault,  } from './fault';
import { HealthStatus } from './health-status';

export const color = {
  Healthy: [40, 167, 69],
  Warning: [255, 193, 7],
  Critical: [254, 109, 44],
  Fault: [255, 0, 0]
} as const;

export type FaultDiagnosis = {
  faults: Fault[];
  healthIndex: number;
  status: HealthStatus;
  timestamp: number;
};

type FaultDiagnosisDTO = {
  timestamp: number;
  dataTimestamp: number;
  result: {
    ruleId: number; // 规则id
    confidence: 1 | 2 | 3 | 4; // 置信度 1：不明显 2：轻微 3：较严重 4：严重
  }[];
};


