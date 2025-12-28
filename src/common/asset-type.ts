// constants begin
export enum Value {
  Device = 100,
  WindTurbine = 101,
  Flange = 102,
  Tower = 103,
  Area = 201,
  Pipe = 221,
  Tank = 222,
  Motor = 351
}

const configs: Config[] = [
  { key: Value.Device, label: Value[Value.Device], children: [] },
  {
    key: Value.WindTurbine,
    label: Value[Value.WindTurbine],
    children: [Value.Flange, Value.Tower],
    isRoot: true
  },
  { key: Value.Flange, label: Value[Value.Flange], children: [] },
  { key: Value.Tower, label: Value[Value.Tower], children: [] },
  {
    key: Value.Area,
    label: Value[Value.Area],
    children: [Value.Area, Value.Pipe, Value.Tank, Value.Motor],
    isRoot: true
  },
  { key: Value.Pipe, label: Value[Value.Pipe], children: [] },
  { key: Value.Tank, label: Value[Value.Tank], children: [] },
  { key: Value.Motor, label: Value[Value.Motor], children: [] }
];
// constants end

// types begin
type Config = {
  key: number;
  label: string;
  children: number[];
  isRoot?: boolean;
};
// types end
