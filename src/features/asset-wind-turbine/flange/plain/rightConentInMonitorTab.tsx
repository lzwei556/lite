import React from 'react';
import { AssetRow, HistoryData, Points } from '../../../../asset-common';
import { HistoryDataFea } from 'features';
import { MonitoringPointType } from 'common';
import { Card } from 'components';
import intl from 'react-intl-universal';

export const RightConentInMonitorTab = ({
  asset,
  historyDatas
}: {
  asset: AssetRow;
  historyDatas: { name: string; data: HistoryData }[] | undefined;
}) => {
  const getProperties = () => {
    const points = Points.filter(asset.monitoringPoints);
    const firstPoint = points[0];
    return MonitoringPointType.Key.getProperties(firstPoint.type, firstPoint.properties);
  };
  const property = getProperties()?.[0];
  return (
    property && (
      <Card
        title={
          property
            ? intl.get('OBJECT_TREND_CHART', {
                object: intl.get(property.name)
              })
            : intl.get('TREND_CHART')
        }
      >
        <HistoryDataFea.PropertyChartList
          data={historyDatas}
          property={property}
          style={{ height: 600 }}
        />
      </Card>
    )
  );
};
