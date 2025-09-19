import React from 'react';
import { Form, FormItemProps, InputNumberProps } from 'antd';
import _ from 'lodash';
import { Card, FormItem, TextFormItem } from '../components';
import { PrimaryAssetModel } from './common';

export const FormItems = <P extends object>({ model }: { model: PrimaryAssetModel<P> }) => {
  const properties = useProperties(model);
  console.log('properties', properties);
  const monitoringPoints = useMonitoringPoints(model);
  return (
    <>
      {properties.map(({ group, items }, index) => (
        <Card
          key={`${group}${index}`}
          style={{ marginTop: index !== 0 ? 16 : undefined }}
          title={group}
        >
          {items.map((item) => (
            <FormItem {...item} key={item.name} />
          ))}
        </Card>
      ))}
      <Card style={{ marginTop: 16 }} title='监测点'>
        <Form.List
          name='monitoring_points'
          initialValue={monitoringPoints.map((m) => ({ name: m.name }))}
        >
          {(fields) =>
            fields.map((field) => <TextFormItem {...field} name={[field.name, 'name']} />)
          }
        </Form.List>
      </Card>
    </>
  );
};

const useProperties = <P extends object>(model: PrimaryAssetModel<P>) => {
  const { property } = model;
  const propertyWithName = _.mapValues(property, (value, key) => ({ ...value, name: key }));
  const dic = _.groupBy(propertyWithName, (value) => value.group ?? '');
  return Object.entries(dic).map(([group, items]) => {
    return { group, items: items.map(transform) };
  });
};

const transform = <P extends object>(
  item: { name: string } & PrimaryAssetModel<P>['property'][keyof PrimaryAssetModel<P>['property']]
): FormItemProps & { inputNumberProps?: InputNumberProps } => {
  const { desc, name, type, unit, value } = item;
  let inputNumberProps: InputNumberProps | undefined;
  if (type === 'float' || type === 'int') {
    inputNumberProps = { addonAfter: unit };
  }
  return { label: desc, name, initialValue: value, inputNumberProps };
};

const useMonitoringPoints = <P extends object>(model: PrimaryAssetModel<P>) => {
  const { measure } = model;
  const measureWithName = _.mapValues(measure, (value, key) => ({ ...value, key }));
  return Object.values(measureWithName);
};
