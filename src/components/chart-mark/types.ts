export type Coord = [x: string | number, y: number | string];
export type Mark = {
  name: string;
  label?: string | number;
  value?: string | number;
  data: Coord | [Coord, Coord] | string;
  dataProps?: { valueFormatter?: (value?: string | number) => string; lineStyle?: object };
  description?: string;
  type?: string;
  style?: { labelFormatter?: string; color?: string; label?: any };
};
export type PointMark = Omit<Mark, 'data'> & { data: Coord };
export type LineMark = Omit<Mark, 'data'> & { data: [Coord, Coord] | string };
