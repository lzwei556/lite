import React from 'react';
import { roundValue } from '../../../../utils/format';
import { DisplayProperty } from '../../../../constants/properties';
import { FakeVSRealChart } from './fakeVSRealChart';

export type StatusData = {
  timestamp: number;
  values: {
    key: string;
    name: string;
    precision: number;
    sort: number;
    unit: string;
    fields: { key: string; name: string; dataIndex: number; value: number }[];
    data: {
      [propName: string]: number | { index: number; value: number; timestamp: number }[] | number[];
    };
    isShow: boolean;
  }[];
};

export function SingleStatus({
  properties,
  flangeData
}: {
  properties: DisplayProperty[];
  flangeData?: StatusData;
}) {
  const [property, setProperty] = React.useState(properties.length > 0 ? properties[0] : undefined);

  let points: number[] = [];
  let indexs: number[] = [];
  let bolts: number[] = [];
  if (property) {
    const propertyInput = flangeData?.values.find(({ key }) => key === `${property.key}_input`);
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
    const fake = flangeData?.values.find(({ fields }) =>
      fields.find((field) => field.key === property.key)
    );
    if (fake) {
      const field = fake.fields.find((field) => field.key === property.key);
      if (field) {
        const fakeDatas = fake.data[field.name] as number[];
        if (fakeDatas.length > 0) {
          bolts = fakeDatas.map((value) => roundValue(value));
        }
      }
    }
  }

  return (
    <FakeVSRealChart
      bolts={bolts}
      hideTitle={true}
      onPropertyChange={(key) => setProperty(properties.find((property) => property.key === key)!)}
      points={{
        data: points,
        indexs
      }}
      property={property}
      properties={properties}
    />
  );
}
