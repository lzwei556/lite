import { pickOptionsFromNumericEnum } from '../utils';

export enum ProjectType {
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

export const useProjectTypeOptions = () => pickOptionsFromNumericEnum(ProjectType, 'project.type');
