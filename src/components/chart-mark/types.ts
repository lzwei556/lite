export type Coord = [x: string | number, y: number | string];
export type Mark = {
  name: string;
  label?: string | number;
  value?: string | number;
  data: Coord | [Coord, Coord] | string;
  description?: string;
  type?: string;
  chartPorps?: { label?: any; symbol?: string; lineStyle?: any; itemStyle?: any };
};
export type PointMark = Omit<Mark, 'data'> & { data: Coord };
export type LineMark = Omit<Mark, 'data'> & { data: [Coord, Coord] | string };
