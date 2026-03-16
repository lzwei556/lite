import { pickOptionsFromNumericEnum } from '../utils';

export enum ProjectType {
  Condition = 0x00,
  BoltWindPower = 0x11,
  BoltHydroPower = 0x12,
  BoltTower = 0x13,
  BoltRail = 0x14,
  BoltBridge = 0x15,
  Corrosion = 0x21,
  Vibration = 0x31,
  Temperature = 0x32,
  Pressure = 0x33,
  Bolt = 0x34
}

export const useProjectTypeOptions = () => pickOptionsFromNumericEnum(ProjectType, 'project');
