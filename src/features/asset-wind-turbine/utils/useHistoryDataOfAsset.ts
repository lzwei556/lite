import React from 'react';
import { AssetRow, getDataOfMonitoringPoint, HistoryData, Points } from '../../../asset-common';
import { Dayjs } from '../../../utils';

export function useHistoryDatas(
  asset?: AssetRow,
  range = Dayjs.toRange(Dayjs.CommonRange.PastWeek)
) {
  const [from, to] = range;
  const [historyDatas, setHistoryDatas] = React.useState<
    { name: string; data: HistoryData; height?: number; radius?: number }[] | undefined
  >();
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    const points = Points.filter(asset?.monitoringPoints);
    if (points.length > 0 && from && to) {
      const fetchs = points.map(({ id }) => getDataOfMonitoringPoint(id, from, to));
      setLoading(true);
      Promise.all(fetchs)
        .then((datas) =>
          setHistoryDatas(
            datas.map((data, index) => ({
              name: points[index].name,
              data,
              height: points[index].attributes?.tower_install_height,
              radius: points[index].attributes?.tower_base_radius
            }))
          )
        )
        .finally(() => setLoading(false));
    }
  }, [asset, from, to]);
  return { historyDatas, loading };
}
