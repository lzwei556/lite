import { getColorByValue, getLabelByValue } from '../assetStatus';
import { INVALID_MONITORING_POINT } from '../../monitoring-point';

export type AssetChildrenStatistics = {
  alarmNum?: [number, number, number];
  assetId: number;
  deviceNum: number;
  monitoringPointNum: number;
  offlineDeviceNum: number;
};

export function resolveStatus(monitoringPointNum: number, alarmNum?: [number, number, number]) {
  let normal = monitoringPointNum;
  let info = 0,
    warn = 0,
    danger = 0;
  if (alarmNum && alarmNum.length === 3) {
    info = alarmNum[0];
    warn = alarmNum[1];
    danger = alarmNum[2];
    normal = normal - info - warn - danger;
  }
  return [normal, info, warn, danger].map((n, i) => ({
    name: getLabelByValue(i),
    value: n,
    color: getColorByValue(i),
    level: i
  }));
}

export function resolveDescendant(statis: AssetChildrenStatistics) {
  const { deviceNum, offlineDeviceNum, monitoringPointNum } = statis;
  const anomalous = resolveStatus(statis.monitoringPointNum, statis.alarmNum)
    .map(({ value }) => value)
    .slice(1)
    .reduce((prev, crt) => prev + crt);
  return [
    { name: 'monitoring.points', value: monitoringPointNum },
    { name: INVALID_MONITORING_POINT, value: anomalous },
    { name: 'devices', value: deviceNum },
    { name: 'offline.devices', value: offlineDeviceNum }
  ];
}
