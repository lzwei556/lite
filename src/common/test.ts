import { ToSnake } from 'ts-case-convert';
import { Option } from '../common';

type ToLabel<P> = P extends `${infer First}_${infer Rest}` ? `${First}.${ToLabel<Rest>}` : P;

type Name<Entity extends Object> = keyof Entity;
type Label<Entity extends Object> = ToLabel<Lowercase<ToSnake<Name<Entity>>>>;
// eg.
// mixed  initial_thickness: { enabled:true, value:2 }
// separated initial_thickness: 2  initial_thickness_enabled: true
export type NameMode = 'mixed' | 'separated';

export type Field<Entity extends Object> = {
  name: Name<Entity>;
  label: Label<Entity> | string;
  description: `${Label<Entity>}.desc`;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'number-switcher';
  options?: Option[];
  optionType?: 'checkbox' | 'select';
  defaultValue?: any;
  unit?: string;
  translatingUnit?: string;
  nameMode?: NameMode;
};

export type VibrationDirectionAttributes = {
  [Key in 'axial' | 'vertical' | 'horizontal']: 'x' | 'y' | 'z';
};

type NumericPosition = { index: number };

type InclinationAttributes = NumericPosition & { tower_install_angle: number };

type TopInclinationAttributes = InclinationAttributes & {
  tower_install_height: number;
};

type BaseInclinationAttributes = InclinationAttributes & {
  tower_base_radius: number;
};

export type CorrosionAttributes = NumericPosition & {
  initial_thickness_enabled: boolean;
  initial_thickness: number;
  critical_thickness_enabled: boolean;
  critical_thickness: number;
  corrosion_rate_short_term: number;
  corrosion_rate_long_term: number;
};

type VibrationAttributes = { index: string } & VibrationDirectionAttributes;

export type MonitoringPointAttributes =
  | NumericPosition
  | TopInclinationAttributes
  | BaseInclinationAttributes
  | CorrosionAttributes
  | VibrationAttributes;

type FieldWithSource<Src extends string, Entity extends object> = Field<Entity> & { source: Src };

export type AttributesField =
  | FieldWithSource<'position', NumericPosition>
  | FieldWithSource<'top-inclination', TopInclinationAttributes>
  | FieldWithSource<'base-inclination', BaseInclinationAttributes>
  | FieldWithSource<'corrosion', CorrosionAttributes>
  | FieldWithSource<'vibration', VibrationAttributes>;

const attr: MonitoringPointAttributes = {
  corrosion_rate_short_term: 30
};
