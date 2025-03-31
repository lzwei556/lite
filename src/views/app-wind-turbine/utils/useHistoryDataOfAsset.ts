import React from 'react';
import { AssetRow, getDataOfMonitoringPoint, HistoryData, Points } from '../../asset-common';
import { Dayjs } from '../../../utils';
import { commonRange } from '../../../components';

export function useHistoryDatas(asset?: AssetRow, range = Dayjs.toRange(commonRange.PastWeek)) {
  const [from, to] = range;
  const [historyDatas, setHistoryDatas] = React.useState<
    { name: string; data: HistoryData; height?: number; radius?: number }[] | undefined
  >();
  React.useEffect(() => {
    const points = Points.filter(asset?.monitoringPoints);
    if (points.length > 0 && from && to) {
      const fetchs = points.map(({ id }) => getDataOfMonitoringPoint(id, from, to));
      Promise.all(fetchs).then((datas) =>
        setHistoryDatas(
          datas.map((data, index) => ({
            name: points[index].name,
            data,
            height: points[index].attributes?.tower_install_height,
            radius: points[index].attributes?.tower_base_radius
          }))
        )
      );
    }
  }, [asset, from, to]);
  return historyDatas;
}
