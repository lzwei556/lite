import { Option } from 'common/types';

export type ProcessType = {
  key: number;
  label: string;
  sourceType: number;
  deviceType?: number;
  parameters: {
    name: string | string[];
    label: string;
    type: 'string' | 'number';
    options?: Option[];
    rules?: object[];
    unit?: string;
    disabled?:boolean
  }[];
};
