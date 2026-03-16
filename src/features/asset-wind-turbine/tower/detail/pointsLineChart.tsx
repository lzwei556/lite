import React from 'react';
import { Translation } from 'locales/utils';
import { Card } from '../../../../components';
import { HistoryDataFea } from '../../..';
import {
  AssetRow,
  hasData,
  HistoryData,
  Points,
  PropertyLightSelectFilter
} from '../../../../asset-common';
import { MonitoringPointType, CharacteristicData } from 'common';

export const PointsLineChart = ({
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
  const properties = getProperties();
  const [property, setProperty] = React.useState<CharacteristicData.DisplayProperty | undefined>(
    properties?.[0]
  );
  const getTitle = () => {
    return property
      ? Translation.get('label.title.trend.sth', {
          object: Translation.get(property.name)
        })
      : Translation.get('label.title.trend');
  };

  return (
    <Card
      extra={
        hasData(historyDatas) && (
          <PropertyLightSelectFilter
            onChange={(key) => setProperty(properties.find((p) => p.key === key))}
            properties={properties}
            value={property?.key}
          />
        )
      }
      title={getTitle()}
    >
      {property && (
        <HistoryDataFea.PropertyChartList
          data={historyDatas}
          property={property}
          style={{ height: 600 }}
        />
      )}
    </Card>
  );
};
