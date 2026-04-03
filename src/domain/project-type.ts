import { pickOptionsFromNumericEnum } from 'utils';
import { AppType } from './app-type';

enum Type {
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

export type ProjectType = Type;

const map = new Map<Type, AppType>([
  [Type.WindPowerBoltMonitoring, 'windTurbinePro'],
  [Type.HydroPowerBoltMonitoring, 'hydroTurbine'],
  [Type.TowerBoltMonitoring, 'towerBolt'],
  [Type.RailBoltMonitoring, 'railBolt'],
  [Type.BridgeBoltMonitoring, 'bridgeBolt'],
  [Type.CorrosionMonitoring, 'corrosion'],
  [Type.VibrationMonitoring, 'vibration'],
  [Type.TemperatureMonitoring, 'temperature'],
  [Type.PressureMonitoring, 'pressure'],
  [Type.BoltMonitoring, 'bolt']
]);

export const ProjectTypeConfig = {
  Type,
  getAppType: (type: Type): AppType | undefined => map.get(type),
  get options() {
    return pickOptionsFromNumericEnum(Type, 'project.type');
  }
};
