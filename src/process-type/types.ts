import { Option } from '../common';

export type ProcessType = {
  key: number;
  label: string;
  sourceType: number;
  parameters: {
    name: string | string[];
    label: string;
    type: 'string' | 'number';
    options?: Option[];
    deviceType?: number;
    rules?: object[];
    unit?: string;
  }[];
};
