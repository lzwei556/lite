import React from 'react';
import { getMeasurement, getMeasurements, } from 'asset-common';
import * as MonitoringPoint from 'domain/monitoring-point'

export function useCrossTarget(id: number) {
  const [points, setPoints] = React.useState<
    {
      label: string;
      value: number;
      selected?: boolean;
      attributes?: MonitoringPoint.Types.Entity['attributes'];
    }[]
  >();

  React.useEffect(() => {
    if (id) {
      getMeasurement(id)
        .then((point) => getMeasurements({ asset_id: point.assetId }))
        .then((ps) =>
          setPoints(
            ps.map((p) => ({
              label: p.name,
              value: p.id,
              selected: p.id === id,
              attributes: p.attributes
            }))
          )
        );
    }
  }, [id]);

  return { points, setPoints };
}
