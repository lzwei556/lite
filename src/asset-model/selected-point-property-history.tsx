import React from 'react';
import { Card } from '../components';
import { HistoryDataFea } from '../features';
import { appendAxisAliasAbbrToField } from '../features/monitoring-point-vibration/common';
import { useAssetModelContext } from './context';
import { Point } from '../monitoring-point';

export const SelectedPointPropertyHistory = () => {
  const { selectedMonitoringPointExtend, loading, historyData } = useAssetModelContext();
  if (selectedMonitoringPointExtend) {
    const { point, property, axisKey, fieldKey, title } = selectedMonitoringPointExtend;
    return (
      <Card title={`${point.name} ${title}`} size='small'>
        <HistoryDataFea.PropertyChart
          config={{
            opts: {
              yAxis: { name: property.unit },
              grid: { top: 30 }
            },
            switchs: { noDataZoom: true }
          }}
          data={historyData}
          property={
            Point.Assert.isVibrationRelated(point.type)
              ? appendAxisAliasAbbrToField(property, point.attributes)
              : property
          }
          axisKey={axisKey ?? fieldKey}
          loading={loading}
          style={{ height: 140 }}
        />
      </Card>
    );
  } else {
    return null;
  }
};
