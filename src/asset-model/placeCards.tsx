import React from 'react';
import { Link } from '../components';
import { getPropertyItems, useAssetModelContext } from './context';
import { Dayjs } from '../utils';
import { OMonitoringPoint } from 'domain/monitoring-point';
import { AssetTree } from 'domain/asset';

export const usePlaceCards = (selected?: boolean) => {
  const { monitoringPoints, setMonitoringPoints } = useAssetModelContext();

  return monitoringPoints.map((m) => {
    const { self, visibleKeys } = m;
    const { id, name, type, data } = self;
    return {
      title: <Link to={`/${AssetTree.Path.Assets}/${id}-${type}`}>{name}</Link>,
      items: getPropertyItems(
        self,
        OMonitoringPoint.Type.getProperties(self).filter((p) => visibleKeys.includes(p.key))
      ).map((item) => ({
        ...item,
        index: id,
        selected: false,
        onClick: () => {
          if (selected) {
            setMonitoringPoints((prev) =>
              prev.map((m) => {
                if (m.self.id === item.self.id) {
                  return { ...m, ...item, selected: true };
                } else {
                  return { ...m, selected: false };
                }
              })
            );
          }
        }
      })),
      footer: data?.timestamp ? Dayjs.format(data.timestamp) : undefined
    };
  });
};
