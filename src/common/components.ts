import { toSnake } from 'ts-case-convert';
import { transformSnake2Dot } from 'utils';

export enum Value {
  'MotorDrive-End' = 10011,
  'MotorNon-Drive-End' = 10021,
  FanDriveEnd = 20011,
  FanNonDriveEnd = 20021,
  GearboxInput = 30011,
  GearboxOutput = 30021
}

type Component = {
  key: Value;
  label: string;
};

export const Key = {
  get: (key: Value): Component => {
    const PREFIX = 'asset.component.';
    const label = `${PREFIX}${transformSnake2Dot(toSnake(Value[key]))}`;
    return { key, label };
  }
};
