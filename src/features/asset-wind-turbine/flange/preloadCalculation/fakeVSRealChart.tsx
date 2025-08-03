import React from 'react';
import intl from 'react-intl-universal';
import { Card, LineChart } from '../../../../components';
import { DisplayProperty } from '../../../../constants/properties';
import { MONITORING_POINT, PropertyLightSelectFilter } from '../../../../asset-common';

export const FakeVSRealChart = ({
  bolts,
  hideTitle,
  onPropertyChange,
  points,
  property,
  properties = []
}: {
  bolts: number[];
  hideTitle?: boolean;
  onPropertyChange?: (propertyKey: string) => void;
  points: {
    indexs: number[];
    data: number[];
  };
  property?: DisplayProperty;
  properties?: DisplayProperty[];
}) => {
  return (
    <Card
      extra={
        properties.length > 0 && (
          <PropertyLightSelectFilter
            onChange={onPropertyChange}
            properties={properties}
            value={property?.key}
          />
        )
      }
      title={property && !hideTitle ? intl.get(property.name) : undefined}
    >
      {property && (
        <LineChart
          series={
            property
              ? [
                  {
                    data: {
                      [intl.get(MONITORING_POINT)]: points.data
                    },
                    raw: { symbol: 'circle', type: 'scatter' },
                    xAxisValues: points.indexs.map((n) => `${n}`)
                  },
                  {
                    data: {
                      [intl.get('BOLT')]: bolts
                    },
                    xAxisValues: bolts.map((n, i) => `${i + 1}`)
                  }
                ]
              : []
          }
          style={{ height: 600 }}
          config={{ opts: { xAxis: { data: bolts.map((n, i) => `${i + 1}`) } } }}
          yAxisMeta={{ ...property, min: Math.min(...points.data), max: Math.max(...points.data) }}
        />
      )}
    </Card>
  );
};
