import React from 'react';
import { Card } from '../components';
import { HistoryDataFea } from '../features';
import { appendAxisAliasAbbrToField } from '../features/monitoring-point-vibration/common';
import { useAssetModelContext } from './context';

export const SelectedPointPropertyHistory = () => {
  const { selectedMonitoringPointExtend, loading, historyData } = useAssetModelContext();
  if (selectedMonitoringPointExtend) {
    const { point, property, axisKey, title } = selectedMonitoringPointExtend;
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
          property={appendAxisAliasAbbrToField(property, point.attributes)}
          axisKey={axisKey}
          loading={loading}
          style={{ height: 140 }}
        />
      </Card>
    );
  } else {
    return null;
  }
};
