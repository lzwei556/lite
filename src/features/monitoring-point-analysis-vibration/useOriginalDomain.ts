import React from 'react';
import { getDynamicData } from 'asset-common';

export type OriginalDomainResponse = {
  frequency: number;
  fullScale: number;
  number: number;
  range: number;
  values: number[];
  xAxis: number[];
  xAxisUnit?: string;
};

export function useOriginalDomain(id: number | undefined, timestamp: number, axis: number) {
  const [data, setData] = React.useState<OriginalDomainResponse>();
  React.useEffect(() => {
    if (id) {
      getDynamicData<{ values: OriginalDomainResponse; timestamp: number }>(id, timestamp, 'raw', {
        field: 'originalDomain',
        axis: axis
      }).then((data) => {
        if (data) {
          const { xAxis, values } = data.values;
          if (xAxis && values) {
            setData(data.values);
          }
        }
      });
    }
  }, [id, timestamp, axis]);
  return data;
}
