import React from 'react';
import { getTrend, TrendData } from '../../../asset-common';

export type Property = {
  label: string;
  value: 'acceleration' | 'velocity' | 'displacement';
  selected?: boolean;
  unit?: string;
  disabled?: boolean;
  precision: number;
};

const SVT_OPTIONS: Property[] = [
  {
    label: 'FIELD_ACCELERATION',
    value: 'acceleration',
    selected: true,
    unit: 'm/s²',
    precision: 3
  },
  { label: 'FIELD_VELOCITY', value: 'velocity', unit: 'mm/s', precision: 3 },
  { label: 'FIELD_DISPLACEMENT', value: 'displacement', unit: 'μm', precision: 3 }
];

export function useProperties(value?: string) {
  const [properties, setProperties] = React.useState<Property[]>(SVT_OPTIONS);
  const _properties = properties.map((p) => ({
    ...p,
    disabled: value ? p.value !== value : false
  }));
  return {
    property: _properties.find((p) => !!p.selected && !p.disabled) ?? properties[0],
    properties: _properties,
    setProperties
  };
}

export type TrendDataProps = {
  loading: boolean;
  data: TrendData[];
};

export function useTrendData(id: number, range: [number, number]) {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<TrendData[]>([]);
  const [from, to] = range;

  React.useEffect(() => {
    setLoading(true);
    getTrend(id, from, to)
      .then((data) => {
        if (data) {
          setData(data.map((d, i) => ({ ...d, selected: i === data.length - 1 })));
        }
      })
      .finally(() => setLoading(false));
  }, [id, from, to]);

  return { loading, data };
}
