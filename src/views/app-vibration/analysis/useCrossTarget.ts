import React from 'react';
import { getMeasurement, getMeasurements } from '../../asset-common';

export function useCrossTarget(id: number) {
  const [points, setPoints] =
    React.useState<{ label: string; value: number; selected?: boolean }[]>();

  React.useEffect(() => {
    if (id) {
      getMeasurement(id)
        .then((point) => getMeasurements({ asset_id: point.assetId }))
        .then((ps) =>
          setPoints(ps.map((p) => ({ label: p.name, value: p.id, selected: p.id === id })))
        );
    }
  }, [id]);

  return { points, setPoints };
}
