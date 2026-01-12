import { useRequest } from 'ahooks';
import request from 'utils/request';
import { GetResponse } from 'utils/response';

export type FlangeStatusData = {
  timestamp: number;
  values: {
    key: string;
    name: string;
    precision: number;
    sort: number;
    unit: string;
    fields: { key: string; name: string; dataIndex: number; value: number }[];
    data: {
      [propName: string]: number | { index: number; value: number; timestamp: number }[] | number[];
    };
    isShow: boolean;
  }[];
};

export const useFlangeData = () => useRequest(getFlangeData, { manual: true });

export const useFlangeDatas = () => useRequest(getDataOfAsset, { manual: true });

const getDataOfAsset = async (id: number, from: number, to: number) => {
  return await request
    .get<{ timestamp: number }[]>(`/assets/${id}/data?from=${from}&to=${to}`)
    .then(GetResponse);
};

const getFlangeData = async (id: number, timestamp: number) => {
  return await request.get<FlangeStatusData>(`/assets/${id}/data/${timestamp}`).then(GetResponse);
};
