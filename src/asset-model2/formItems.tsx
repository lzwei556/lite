import React from 'react';
import { Col, ColProps, FormItemProps, InputNumberProps } from 'antd';

import _ from 'lodash';
import { toSnake } from 'ts-case-convert';
import { VibrationMonitoringPoint } from '../features';
import { Card, FormItem, Grid, TextFormItem } from '../components';
import {
  PrimaryAssetModel,
  PrimaryAssetModelMeasureItem,
  PrimaryAssetModelPropertyValue
} from './common';
import { transformSnake2Dot } from '../utils';
import { Translation } from 'locales/utils';

type GeneralFormItemProps = FormItemProps & { inputNumberProps?: InputNumberProps };

export const FormItems = <P extends object, M extends object>({
  model,
  formItemColProps
}: {
  model: PrimaryAssetModel<P, M>;
  formItemColProps: ColProps;
}) => {
  const properties = useGroupedProperties(model.property);
  const monitoringPoints = useMonitoringPoints(model.measure);

  return (
    <>
      {properties.map(({ group, items }, index) => (
        <Card
          key={`${group}${index}`}
          style={{ marginTop: index !== 0 ? 16 : undefined }}
          title={Translation.get(group.length > 0 ? group : 'feature.properties')}
        >
          <Grid>
            {items.map((item) => (
              <Col {...formItemColProps} key={item.name}>
                <FormItem {...item} />
              </Col>
            ))}
          </Grid>
        </Card>
      ))}
      {monitoringPoints.map((m) => (
        <Card style={{ marginTop: 16 }} title={Translation.get(m.name)} key={m.name}>
          <Grid>
            <TextFormItem name='type' hidden={true} />
            <VibrationMonitoringPoint.FormItems
              monitoringPoint={{ ...m, name: Translation.get(m.name) }}
              formItemColProps={formItemColProps}
            />
          </Grid>
        </Card>
      ))}
    </>
  );
};

const useGroupedProperties = (property: { [key: string]: PrimaryAssetModelPropertyValue }) => {
  const propertyWithName = _.mapValues(property, (value, key) => ({ ...value, name: key }));
  const dic = _.groupBy(propertyWithName, (value) => value.group ?? '');
  return Object.entries(dic).map(([group, items]) => {
    return { group, items: items.map(transform) };
  });
};

const transform = (
  item: { name: string } & PrimaryAssetModelPropertyValue
): GeneralFormItemProps => {
  const { desc, name, type, unit, value } = item;
  let inputNumberProps: InputNumberProps | undefined;
  if (type === 'float' || type === 'int') {
    inputNumberProps = { addonAfter: unit };
  }
  return { label: desc, name, initialValue: value, inputNumberProps };
};

const useMonitoringPoints = (measure: { [key: string]: PrimaryAssetModelMeasureItem }) => {
  const measureWithName = _.mapValues(measure, (value, key) => ({
    ...value,
    key,
    name: transformSnake2Dot(toSnake(key))
  }));
  return Object.values(measureWithName);
};
