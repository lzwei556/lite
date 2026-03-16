import React from 'react';
import { AssetRow, HistoryData, Points } from '../../../../asset-common';
import { HistoryDataFea } from 'features';
import { MonitoringPointType } from 'common';
import { Card } from 'components';
import { Translation } from 'locales/utils';

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
            ? Translation.get('label.title.trend.sth', {
                object: Translation.get(property.name)
              })
            : Translation.get('label.title.trend')
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
