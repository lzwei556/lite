import { pickOptionsFromNumericEnum } from 'utils';
import * as App from './app-type';

export enum Enum {
  ConditionMonitoring = 0x00,
  WindPowerBoltMonitoring = 0x11,
  HydroPowerBoltMonitoring = 0x12,
  TowerBoltMonitoring = 0x13,
  RailBoltMonitoring = 0x14,
  BridgeBoltMonitoring = 0x15,
  CorrosionMonitoring = 0x21,
  VibrationMonitoring = 0x31,
  TemperatureMonitoring = 0x32,
  PressureMonitoring = 0x33,
  BoltMonitoring = 0x34
}

const map = new Map<Enum, App.Type>([
  [Enum.WindPowerBoltMonitoring, 'windTurbinePro'],
  [Enum.HydroPowerBoltMonitoring, 'hydroTurbine'],
  [Enum.TowerBoltMonitoring, 'towerBolt'],
  [Enum.RailBoltMonitoring, 'railBolt'],
  [Enum.BridgeBoltMonitoring, 'bridgeBolt'],
  [Enum.CorrosionMonitoring, 'corrosion'],
  [Enum.VibrationMonitoring, 'vibration'],
  [Enum.TemperatureMonitoring, 'temperature'],
  [Enum.PressureMonitoring, 'pressure'],
  [Enum.BoltMonitoring, 'bolt']
]);

export const getAppType = (type: Enum): App.Type | undefined => map.get(type);
export const options = pickOptionsFromNumericEnum(Enum, 'project.type');
