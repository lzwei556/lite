import React from 'react';
import { Card } from '../components';
import { HistoryDataFea } from '../features';
import { getPropertyItems, useAssetModelContext } from './context';
import { MonitoringPointRow, Point } from '../monitoring-point';
import { FeatureData, MonitoringPointType } from 'common';

export const SelectedPointPropertyHistory = () => {
  const { selectedMonitoringPoint, loading, historyData } = useAssetModelContext();
  if (selectedMonitoringPoint) {
    const { self, property, axisKey, fieldKey } = selectedMonitoringPoint;

    const getTitle = (m: MonitoringPointRow, property: FeatureData.DisplayProperty) => {
      const key = property.key;
      const items = getPropertyItems(
        m,
        MonitoringPointType.Key.getProperties(m.type, m.properties)
      );
      let title = items.find((item) => item.property?.key === key)?.title;
      if (axisKey) {
        title = items.find((item) => item.property?.key === key && item.axisKey === axisKey)?.title;
      }
      if (fieldKey) {
        title = items.find(
          (item) => item.property?.key === key && item.fieldKey === fieldKey
        )?.title;
      }
      return title;
    };

    return (
      property && (
        <Card title={`${self.name} ${getTitle(self, property)}`} size='small'>
          <HistoryDataFea.PropertyChart
            config={{
              opts: {
                yAxis: { name: property?.unit },
                grid: { top: 30 }
              },
              switchs: { noDataZoom: true }
            }}
            data={historyData}
            property={
              Point.Assert.isVibrationRelated(self.type)
                ? {
                    ...property,
                    fields: FeatureData.appendVibrationDirectionAbbrToField(
                      property.fields,
                      self.attributes
                    )
                  }
                : property
            }
            axisKey={axisKey ?? fieldKey}
            loading={loading}
            style={{ height: 120 }}
          />
        </Card>
      )
    );
  } else {
    return null;
  }
};
