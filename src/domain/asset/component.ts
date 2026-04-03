import { toSnake } from 'ts-case-convert';
import { transformSnake2Dot } from 'utils';

export enum Id {
  MotorDriveEnd = 10011,
  MotorNonDriveEnd = 10021,
  FanDriveEnd = 20011,
  FanNonDriveEnd = 20021,
  GearboxInput = 30011,
  GearboxOutput = 30021
}

export type ComponentId = Id;

export const Component = {
  Id,
  get: (key: Id) => {
    const PREFIX = 'component.';
    const label = `${PREFIX}${transformSnake2Dot(toSnake(Id[key]))}`;
    return { key, label };
  }
};
