import { roundValue } from 'utils';
import { getDynamicData } from 'monitoring-point/services';
import { useRequest } from 'ahooks';
import React from 'react';
import { TimeDomainInput } from './useProps';
import { OriginalDomainResponse } from './useOriginalDomain';

export type TimeDomainData = {
  x: number[];
  y: number[];
  range: number;
  frequency: number;
  number: number;
  timestamp: number;
  xAxisUnit?: string;
};

export const useTimeDomain = ({ axis, id, property, timestamp }: TimeDomainInput) => {
  const { loading, data, runAsync } = useRequest(getTimeDomain, {
    manual: true
  });

  React.useEffect(() => {
    if (!axis || !property || !id || !timestamp) return;

    runAsync({ axis, id, property, timestamp });
  }, [axis, id, property, timestamp, runAsync]);

  return { loading, data };
};

const getTimeDomain = async ({
  id,
  timestamp,
  axis,
  property
}: TimeDomainInput): Promise<TimeDomainData | null> => {
  const data = await getDynamicData<{ values: OriginalDomainResponse; timestamp: number }>(
    id,
    timestamp,
    'raw',
    {
      field: `${property.value}TimeDomain`,
      axis: axis.value
    }
  );
  if (!data) return null;

  const { xAxis, values, range, frequency, number, xAxisUnit } = data.values;

  if (!xAxis.length) return null;

  const len = Math.min(xAxis.length, values.length);

  return {
    x: xAxis.slice(0, len).map((n) => roundValue(n)),
    y: values.slice(0, len),
    range,
    frequency,
    number,
    timestamp: data.timestamp,
    xAxisUnit
  };
};

type ItemState = {
  data: TimeDomainData | null;
  filterKey: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
};

type Timestamp = number;

type UseTimeDomainListProps = Omit<TimeDomainInput, 'timestamp'> & {
  initialTimestamps?: Timestamp[];
  maxSelection?: number;
};

export type UseTimeDomainListResult = {
  selected: number[];
  itemMap: Map<number, ItemState>;
  loading: boolean;
  getDataList: () => TimeDomainData[];
  toggleTimestamp: (timestamp: number) => void;
  replaceTimestamp: (oldTimestamp: number | undefined, newTimestamp: number) => void;
};

const MAX = 5;

export const useTimeDomainList = ({
  id,
  axis,
  property,
  initialTimestamps = [],
  maxSelection = MAX
}: UseTimeDomainListProps): UseTimeDomainListResult => {
  const [selected, setSelected] = React.useState<number[]>(() =>
    initialTimestamps.slice(0, maxSelection)
  );
  const [itemMap, setItemMap] = React.useState<Map<number, ItemState>>(() => new Map());
  const [loading, setLoading] = React.useState(false);

  const requestVersionRef = React.useRef(0);
  const prevSelectedRef = React.useRef<number[]>(selected);

  const filterKey = axis && property ? `${axis.value}-${property.value}` : null;

  /* ------------------------- */
  /* selection logic           */
  /* ------------------------- */

  const toggleTimestamp = React.useCallback(
    (timestamp: number) => {
      setSelected((prev) => {
        if (prev.includes(timestamp)) return prev.filter((t) => t !== timestamp);
        if (prev.length >= maxSelection) return prev;
        return [...prev, timestamp];
      });
    },
    [maxSelection]
  );

  const replaceTimestamp = React.useCallback(
    (oldTimestamp: number | undefined, newTimestamp: number) => {
      setSelected((prev) => {
        let next = prev.filter((t) => t !== oldTimestamp);
        if (!next.includes(newTimestamp) && next.length < maxSelection) {
          next = [...next, newTimestamp];
        }
        return next;
      });
    },
    [maxSelection]
  );

  /* ------------------------- */
  /* fetch single timestamp    */
  /* ------------------------- */

  const fetchSingle = React.useCallback(
    async (timestamp: number, currentFilterKey: string, version: number) => {
      if (!id || !axis || !property) return;

      setItemMap((prev) => {
        const next = new Map(prev);
        const prevItem = next.get(timestamp);
        next.set(timestamp, {
          data: prevItem?.data ?? null,
          filterKey: currentFilterKey,
          status: 'loading'
        });
        return next;
      });

      try {
        const data = await getTimeDomain({ id, timestamp, axis, property });
        if (version !== requestVersionRef.current) return;

        setItemMap((prev) => {
          const next = new Map(prev);
          next.set(timestamp, {
            data,
            filterKey: currentFilterKey,
            status: data ? 'success' : 'error'
          });
          return next;
        });
      } catch {
        if (version !== requestVersionRef.current) return;

        setItemMap((prev) => {
          const next = new Map(prev);
          next.set(timestamp, {
            data: null,
            filterKey: currentFilterKey,
            status: 'error'
          });
          return next;
        });
      }
    },
    [id, axis, property]
  );

  /* ------------------------- */
  /* single effect: handle new selection and axis/property changes */
  /* ------------------------- */

  React.useEffect(() => {
    if (!filterKey || !selected.length) return;

    const prevSelected = prevSelectedRef.current;
    const added = selected.filter((ts) => !prevSelected.includes(ts));

    // Determine if this is an axis/property change
    const axisPropertyChanged = prevSelected.length === selected.length;
    const toFetch = axisPropertyChanged ? [...selected] : [...added];

    if (!toFetch.length) {
      prevSelectedRef.current = selected;
      return;
    }

    prevSelectedRef.current = selected;
    requestVersionRef.current += 1;
    const version = requestVersionRef.current;

    setLoading(true);

    const promises = toFetch.map((ts) => {
      const prevItem = itemMap.get(ts);
      const shouldFetch =
        !prevItem || prevItem.filterKey !== filterKey || prevItem.status === 'error';

      if (!shouldFetch) return Promise.resolve(null);

      // mark loading for timestamp
      setItemMap((prev) => {
        const next = new Map(prev);
        const prevItem = next.get(ts);
        next.set(ts, {
          data: prevItem?.data ?? null,
          filterKey,
          status: 'loading'
        });
        return next;
      });

      return getTimeDomain({ id, timestamp: ts, axis, property })
        .then((data) => ({ ts, data }))
        .catch(() => ({ ts, data: null }));
    });

    Promise.all(promises)
      .then((results) => {
        if (version !== requestVersionRef.current) return; // stale response

        setItemMap((prev) => {
          const next = new Map(prev);
          results.forEach((res) => {
            if (!res) return;
            const { ts, data } = res;
            next.set(ts, {
              data,
              filterKey,
              status: data ? 'success' : 'error'
            });
          });
          return next;
        });
      })
      .finally(() => {
        if (version === requestVersionRef.current) setLoading(false);
      });
  }, [selected, axis, property, filterKey, id, fetchSingle]); // ✅ itemMap removed

  /* ------------------------- */
  /* derived values            */
  /* ------------------------- */

  const getDataList = React.useCallback((): TimeDomainData[] => {
    return selected
      .map((ts) => itemMap.get(ts))
      .filter((item) => item?.status === 'success')
      .map((item) => item!.data as TimeDomainData);
  }, [selected, itemMap]);

  return {
    selected,
    itemMap,
    loading,
    toggleTimestamp,
    replaceTimestamp,
    getDataList
  };
};
