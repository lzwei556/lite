import request from 'utils/request';
import { FeatureDataDTO, VibrationWaveformFilters, WaveformData } from './types';
import { useRequest } from 'ahooks';
import { Dayjs } from 'utils';
import { MonitoringPoint } from 'common';
import React from 'react';

const CUSTOM_RANGE = Dayjs.CommonRange.PastWeek;
const RECENT_RANGE = Dayjs.CommonRange.PastWeek;

export const useCustomizableIntervals = (
  monitoringPoints: MonitoringPoint[],
  range?: Dayjs.Range
) => {
  const [loading, setLoading] = React.useState(false);
  const [datas, setDatas] = React.useState<
    { id: number; data: FeatureDataDTO; name: string; type: number }[]
  >([]);
  const monitoringPointsRef = React.useRef<MonitoringPoint[]>(monitoringPoints);
  monitoringPointsRef.current = monitoringPoints;

  React.useEffect(() => {
    const currentPoints = monitoringPointsRef.current;

    if (!currentPoints.length) {
      setDatas([]);
      return;
    }

    let cancelled = false;

    const fetchAll = async () => {
      try {
        setLoading(true);
        const results = await Promise.all(
          currentPoints.map(async (mp) => {
            const data = await getData(
              mp.id,
              'monitoringPoints',
              range ?? Dayjs.toRange(CUSTOM_RANGE)
            );

            return {
              id: mp.id,
              name: mp.name,
              type: mp.type,
              data
            };
          })
        );
        if (!cancelled) {
          setDatas(results);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAll();

    return () => {
      cancelled = true;
    };
  }, [range]);

  return { datas, loading, initialRange: CUSTOM_RANGE };
};

export const useBatchWaveformDataDownload = () =>
  useRequest(batchDownloadWaveformData, { manual: true });

const batchDownloadWaveformData = async (
  id: number,
  type: DataType,
  timestamps: number[],
  lang: string,
  filters?: Pick<VibrationWaveformFilters, 'calculate'>
) => {
  // hardcode: calculate: 'accelerationTimeDomain'
  const res = await request.download<Blob>(
    `monitoringPoints/${id}/batchDownload/data?type=${type}&timestamps=${timestamps.join(',')}`,
    filters ? { type, lang, calculate: 'accelerationTimeDomain' } : { type, lang }
  );
  return res;
};

export const useWaveformDataDownload = () => useRequest(downloadWaveformData, { manual: true });

const downloadWaveformData = async (
  id: number,
  timestamp: number,
  type: DataType,
  lang: string,
  filters?: Pick<VibrationWaveformFilters, 'calculate'>
) => {
  const res = await request.download<Blob>(
    `/monitoringPoints/${id}/download/data/${timestamp}`,
    filters ? { type, lang, ...filters } : { type, lang }
  );
  return res;
};

export const useWaveformData = () => useRequest(getWaveformData, { manual: true });

const getWaveformData = async (
  id: number,
  timestamp: number,
  type: DataType,
  filters?: VibrationWaveformFilters
) => {
  const res = await request.get<WaveformData>(
    `/monitoringPoints/${id}/data/${timestamp}`,
    filters ? { type, ...filters } : { type }
  );
  return res.data.data;
};

export const useMonitoringPointWaveforms = (id: number, type: DataType) => {
  const initialRange = CUSTOM_RANGE;
  const {
    data = [],
    loading,
    runAsync
  } = useData([id, 'monitoringPoints', Dayjs.toRange(initialRange), type], true);
  return {
    timestamps: data.map(({ timestamp }) => timestamp),
    loading,
    initialRange,
    fetchData: runAsync
  };
};

export type URLPathname = 'monitoringPoints' | 'devices';

export const clearData = async (
  id: number,
  urlPathname: URLPathname,
  range: Dayjs.Range,
  type?: DataType
) => {
  const [from, to] = range;
  return request.delete(`/${urlPathname}/${id}/data`, type ? { from, to, type } : { from, to });
};

export type DownloadFormData = { properties: string[]; range: Dayjs.RangeValue };

export const useDownloadSubmit = () => useRequest(downloadData, { manual: true });

export const transform2DownloadPostData = (
  values: DownloadFormData,
  lang: string
): DownloadPostData => {
  const [from, to] = Dayjs.toRange(values.range);
  return { from, to, pids: `[${values.properties.map((key) => `"${key}"`).join()}]`, lang };
};

type DownloadPostData = { from: number; to: number; pids: string; lang: string };

const downloadData = async (id: number, urlPathname: URLPathname, params: DownloadPostData) => {
  const res = await request.download<Blob>(`/${urlPathname}/${id}/download/data`, params);
  return res;
};

export const useCustomizableInterval = (id: number, urlPathname: URLPathname, manual = false) => {
  const initialRange = CUSTOM_RANGE;
  const {
    data = [],
    loading,
    runAsync
  } = useData([id, urlPathname, Dayjs.toRange(initialRange)], manual);
  return { data, loading, fetchData: runAsync, initialRange };
};

export const useRecentWeek = (id: number, urlPathname: URLPathname) => {
  const { data = [], loading } = useData([id, urlPathname, Dayjs.toRange(RECENT_RANGE)]);
  return { data, loading };
};

const useData = (params: Parameters<typeof getData>, manual = false) =>
  useRequest(getData, { defaultParams: params, manual });

export type DataType = 'raw' | 'waveform';

const getData = async (
  id: number,
  urlPathname: URLPathname,
  range: Dayjs.Range,
  type?: DataType
) => {
  const [from, to] = range;
  const res = await request.get<FeatureDataDTO>(
    `/${urlPathname}/${id}/data`,
    type ? { from, to, type } : { from, to }
  );
  return res.data.data;
};
