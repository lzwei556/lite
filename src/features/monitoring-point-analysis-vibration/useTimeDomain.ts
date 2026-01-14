import React from 'react';
import { AnalysisCommonProps, OriginalDomainResponse } from './analysisContent';
import { roundValue } from 'utils';
import { getDynamicData } from 'monitoring-point/services';

export type TimeDomainData = {
  x: number[];
  y: number[];
  range: number;
  frequency: number;
  number: number;
  xAxisUnit?: string;
};

export function useTimeDomain({
  id,
  timestamp,
  axis,
  property
}: Omit<AnalysisCommonProps, 'timestamps' | 'parent'>) {
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
          const { xAxis, values, range, frequency, number, xAxisUnit } = data.values;
          if (xAxis.length > 0)
            setData({
              x: xAxis.map((n) => roundValue(n)),
              y: values,
              range,
              frequency,
              number,
              xAxisUnit
            });
        }
      })
      .finally(() => setLoading(false));
  }, [axis.value, id, property.value, timestamp]);

  return { loading, data };
}
