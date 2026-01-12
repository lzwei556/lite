import React from 'react';
import intl from 'react-intl-universal';
import { FeatureData, MonitoringPointType } from 'common';
import { Card, CardProps, LineChart } from 'components';
import { AssetRow, MONITORING_POINT, Points } from 'asset-common';
import { roundValue } from 'utils/format';
import { FlangeStatusData } from './use-services';

export const FakeVSRealChart = ({
  asset,
  cardProps,
  flangeData,
  property
}: {
  asset: AssetRow;
  cardProps?: CardProps;
  flangeData?: FlangeStatusData;
  property?: FeatureData.DisplayProperty;
}) => {
  const { bolts, points, indexs } = flangeData ? transform(flangeData, property?.key) : pick(asset);
  return (
    <Card {...cardProps}>
      <LineChart
        series={
          property
            ? [
                {
                  data: {
                    [intl.get(MONITORING_POINT)]: points
                  },
                  raw: { symbol: 'circle', type: 'scatter' },
                  xAxisValues: indexs.map((n) => `${n}`)
                },
                {
                  data: {
                    [intl.get('BOLT')]: bolts
                  },
                  xAxisValues: bolts.map((_, i) => `${i + 1}`)
                }
              ]
            : []
        }
        style={{ height: 600 }}
        config={{ opts: { xAxis: { data: bolts.map((n, i) => `${i + 1}`) } } }}
        yAxisMeta={{ ...property, min: Math.min(...points), max: Math.max(...points) }}
      />
    </Card>
  );
};

const pick = (asset: AssetRow) => {
  const points = asset.monitoringPoints ?? [];
  const actuals = Points.filter(points).filter((point) => !!point.data);
  const fakes = points
    .filter((point) => MonitoringPointType.Key.filterNonVirtualTypes(point.type))
    .filter((point) => !!point.data);
  let properties: FeatureData.DisplayProperty[] = [];
  if (actuals.length > 0) {
    properties = MonitoringPointType.Key.getProperties(actuals[0].type, actuals[0].properties);
  }
  const property = properties.length > 0 ? properties[0] : undefined;
  let bolts: number[] = [];
  if (fakes.length > 0 && property) {
    bolts = ((fakes[0].data?.values[property.key] || []) as number[]).map((val) => roundValue(val));
  }
  return {
    bolts,
    points: property
      ? actuals.map(({ data }) => roundValue((data?.values[property.key] as number) || NaN))
      : [],
    indexs: actuals.map(({ attributes }) => (attributes ? attributes.index : 1))
  };
};

const transform = (data: FlangeStatusData, propertyKey?: string) => {
  let points: number[] = [];
  let indexs: number[] = [];
  let bolts: number[] = [];
  if (propertyKey) {
    const propertyInput = data?.values.find(({ key }) => key === `${propertyKey}_input`);
    if (propertyInput) {
      const propertyInputDatas = propertyInput.data[propertyInput.name] as {
        index: number;
        value: number;
        timestamp: number;
      }[];
      if (propertyInputDatas.length > 0) {
        points = propertyInputDatas.map(({ value }) => roundValue(value));
        indexs = propertyInputDatas.map(({ index }) => index);
      }
    }
    const fake = data?.values.find(({ fields }) =>
      fields.find((field) => field.key === propertyKey)
    );
    if (fake) {
      const field = fake.fields.find((field) => field.key === propertyKey);
      if (field) {
        const fakeDatas = fake.data[field.name] as number[];
        if (fakeDatas.length > 0) {
          bolts = fakeDatas.map((value) => roundValue(value));
        }
      }
    }
  }
  return { bolts, points, indexs };
};
