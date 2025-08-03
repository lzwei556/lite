import React from 'react';
import intl from 'react-intl-universal';
import { Card } from '../../../../components';
import { DisplayProperty } from '../../../../constants/properties';
import { HistoryDataFea } from '../../..';
import {
  AssetRow,
  hasData,
  HistoryData,
  Point,
  Points,
  PropertyLightSelectFilter
} from '../../../../asset-common';

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
    return Point.getPropertiesByType(firstPoint.type, firstPoint.properties);
  };
  const properties = getProperties();
  const [property, setProperty] = React.useState<DisplayProperty | undefined>(properties?.[0]);
  const getTitle = () => {
    return property
      ? intl.get('OBJECT_TREND_CHART', {
          object: intl.get(property.name)
        })
      : intl.get('TREND_CHART');
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
