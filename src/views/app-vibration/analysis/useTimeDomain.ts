import React from 'react';
import { roundValue } from '../../../utils/format';
import { getDynamicData } from '../../asset-common';
import { AnalysisCommonProps, OriginalDomainResponse } from './analysisContent';

export type TimeDomainData = {
  x: string[];
  y: number[];
  range: number;
  frequency: number;
  number: number;
};

export function useTimeDomain({ id, timestamp, axis, property }: AnalysisCommonProps) {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<TimeDomainData>();
  React.useEffect(() => {
    setLoading(true);
    getDynamicData<{ values: OriginalDomainResponse; timestamp: number }>(id, timestamp, 'raw', {
      field: `${property.value}TimeDomain`,
      axis: axis.value
    })
      .then((data) => {
        if (data) {
          const { xAxis, values, range, frequency, number } = data.values;
          if (xAxis.length > 0)
            setData({
              x: xAxis.map((n) => `${roundValue(n)}`),
              y: values,
              range,
              frequency,
              number
            });
        }
      })
      .finally(() => setLoading(false));
  }, [axis.value, id, property.value, timestamp]);

  return { loading, data };
}
