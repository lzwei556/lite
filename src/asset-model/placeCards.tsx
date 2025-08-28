import React from 'react';
import { ASSET_PATHNAME, AssetRow } from '../asset-common';
import { Link } from '../components';
import { getPropertyItems, useAssetModelContext } from './context';
import { Dayjs } from '../utils';

export const usePlaceCards = (asset: AssetRow, visibledKeys: string[]) => {
  const { setSelectedMonitoringPoint, selectedMonitoringPointExtend } = useAssetModelContext();

  return (asset.monitoringPoints ?? []).map((m) => {
    const { id, name, type } = m;
    return {
      title: <Link to={`/${ASSET_PATHNAME}/${id}-${type}`}>{name}</Link>,
      items: getPropertyItems(
        m,
        (selectedMonitoringPointExtend?.properties ?? []).filter((p) =>
          visibledKeys.includes(p.key)
        )
      ).map((item) => ({
        ...item,
        index: id,
        selected: false,
        onClick: () => {
          setSelectedMonitoringPoint({
            id,
            propertyKey: item.propertyKey,
            axisKey: item.axisKey
          });
        }
      })),
      footer: m.data?.timestamp ? Dayjs.format(m.data.timestamp) : undefined
    };
  });
};
