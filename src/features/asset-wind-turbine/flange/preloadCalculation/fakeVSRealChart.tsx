import React from 'react';
import { Translation } from 'locales/utils';
import { Card, LineChart } from '../../../../components';
import { MONITORING_POINT, PropertyLightSelectFilter } from '../../../../asset-common';
import { CharacteristicData } from 'common';

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
  property?: CharacteristicData.DisplayProperty;
  properties?: CharacteristicData.DisplayProperty[];
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
      title={property && !hideTitle ? Translation.get(property.name) : ' '}
    >
      <LineChart
        series={
          property
            ? [
                {
                  data: {
                    [Translation.get(MONITORING_POINT)]: points.data
                  },
                  raw: { symbol: 'circle', type: 'scatter' },
                  xAxisValues: points.indexs.map((n) => `${n}`)
                },
                {
                  data: {
                    [Translation.get('asset.flange.bolt')]: bolts
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
    </Card>
  );
};
